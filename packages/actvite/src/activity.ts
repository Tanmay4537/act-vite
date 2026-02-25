// packages/actvite/src/activity.ts

import { DiscordSDK } from '@discord/embedded-app-sdk'
import { authenticate } from './auth.js'
import { isEmbedded, patchUrlMappings } from './proxy.js'
import { Errors } from './errors.js'
import { buildAvatarUrl, noop } from './utils.js'
import type {
    ActivityConfig,
    ActivityInstance,
    ActivityParticipant,
    ActivityUser,
    ActivityChannel,
    ActivityGuild,
    ActivityInitState,
} from './types.js'

const DEFAULT_SCOPE = ['identify', 'rpc.activities.write'] as const
const DEFAULT_TOKEN_ROUTE = '/.proxy/api/token'

/**
 * Initializes an Act-Vite Discord Activity.
 *
 * This is the main entry point for Act-Vite. It:
 * - Initializes the Discord Embedded App SDK
 * - Performs OAuth2 authentication
 * - Exchanges the auth code for an access token
 * - Fetches channel and guild information
 * - Sets up participant tracking
 *
 * @param config - Activity configuration options
 * @returns A fully initialized ActivityInstance
 *
 * @example
 * ```ts
 * import { createActivity } from 'actvite'
 *
 * const activity = await createActivity({
 *   clientId: '1234567890123456789',
 * })
 *
 * console.log(`Hello, ${activity.user.username}!`)
 * console.log(`Playing in: ${activity.channel?.name}`)
 * ```
 *
 * @since 0.1.0
 */
export async function createActivity(config: ActivityConfig): Promise<ActivityInstance> {
    // Validate required config
    if (!config.clientId) {
        throw Errors.missingClientId()
    }

    const resolvedConfig: Required<ActivityConfig> = {
        clientId: config.clientId,
        scope: config.scope ?? [...DEFAULT_SCOPE],
        tokenRoute: config.tokenRoute ?? DEFAULT_TOKEN_ROUTE,
        disableConsoleLog: config.disableConsoleLog ?? false,
        onReady: config.onReady ?? noop,
        onError: config.onError ?? noop,
    }

    // Initialize the Discord SDK
    const sdk = new DiscordSDK(resolvedConfig.clientId)

    // Patch URL mappings for iframe proxy (no-op outside Discord)
    if (isEmbedded()) {
        patchUrlMappings([{ prefix: '/.proxy/', target: 'https://discord.com/' }])
    }

    // Authenticate
    let initState: ActivityInitState
    try {
        initState = await authenticate(sdk, resolvedConfig)
    } catch (err) {
        resolvedConfig.onError(err as Parameters<NonNullable<ActivityConfig['onError']>>[0])
        throw err
    }

    // Build the ActivityUser from auth state
    const user = buildUser(initState.auth.user)

    // Fetch channel info
    let channel: ActivityChannel | null = null
    let guild: ActivityGuild | null = null

    try {
        if (sdk.channelId) {
            const channelData = await sdk.commands.getChannel({ channel_id: sdk.channelId })
            channel = {
                id: channelData.id,
                name: channelData.name ?? 'Unknown Channel',
                type: channelData.type,
            }
        }

        if (sdk.guildId) {
            guild = { id: sdk.guildId }
        }
    } catch {
        // Channel/guild info is non-critical — don't fail the whole init
        if (!resolvedConfig.disableConsoleLog) {
            console.warn('[actvite] Could not fetch channel/guild info. This is non-critical.')
        }
    }

    // Set up participant tracking
    const participantCallbacks = new Set<(participants: ActivityParticipant[]) => void>()
    let currentParticipants: ActivityParticipant[] = []

    const updateParticipants = async () => {
        try {
            const result = await sdk.commands.getInstanceConnectedParticipants()
            currentParticipants = result.participants.map((p) => ({
                user: buildUser(p),
                avatarUrl: buildAvatarUrl(p.id, p.avatar ?? null),
            }))
            participantCallbacks.forEach((cb) => cb(currentParticipants))
        } catch {
            // Non-critical
        }
    }

    // Initial participant fetch
    await updateParticipants()

    // Subscribe to participant changes
    sdk.subscribe('ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE', updateParticipants)

    // Build the ActivityInstance
    const activity: ActivityInstance = {
        sdk,
        user,
        channel,
        guild,
        get participants() {
            return currentParticipants
        },
        onParticipantsChange(callback) {
            participantCallbacks.add(callback)
            return () => {
                participantCallbacks.delete(callback)
            }
        },
        isEmbedded: isEmbedded(),
        config: resolvedConfig,
    }

    // Call onReady callback
    await resolvedConfig.onReady(activity)

    if (!resolvedConfig.disableConsoleLog) {
        console.log('[actvite] Activity ready ✓')
    }

    return activity
}

/**
 * Builds an ActivityUser from raw Discord API user data.
 * @internal
 */
function buildUser(rawUser: {
    id: string
    username: string
    discriminator: string
    [key: string]: unknown
}): ActivityUser {
    const avatar = (rawUser.avatar as string | null | undefined) ?? null
    return {
        id: rawUser.id,
        username: rawUser.username,
        discriminator: rawUser.discriminator,
        avatar,
        globalName: (rawUser.global_name as string | null | undefined) ?? null,
        avatarUrl: buildAvatarUrl(rawUser.id, avatar),
        bot: (rawUser.bot as boolean | undefined) ?? false,
        premiumType: ((rawUser.premium_type as number | null | undefined) ?? 0) as 0 | 1 | 2 | 3,
    }
}

