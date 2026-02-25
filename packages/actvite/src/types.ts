// packages/actvite/src/types.ts

import type { DiscordSDK } from '@discord/embedded-app-sdk'

/**
 * Configuration options for initializing an Act-Vite activity.
 *
 * @example
 * ```ts
 * const activity = await createActivity({
 *   clientId: '1234567890',
 *   disableConsoleLog: false,
 * })
 * ```
 *
 * @since 0.1.0
 */
export interface ActivityConfig {
    /**
     * Your Discord application's Client ID.
     * Find this in the Discord Developer Portal under your application.
     * @see https://discord.com/developers/applications
     */
    clientId: string

    /**
     * The scope(s) to request during OAuth2 authentication.
     * Defaults to `['identify', 'rpc.activities.write']`
     */
    scope?: string[]

    /**
     * The URL of your token exchange server endpoint.
     * This endpoint must accept a POST request with a `code` body
     * and return an `access_token`.
     * Defaults to `'/.proxy/api/token'`
     */
    tokenRoute?: string

    /**
     * If true, suppresses all Act-Vite console output.
     * @default false
     */
    disableConsoleLog?: boolean

    /**
     * Callback invoked when the activity successfully authenticates.
     * @param activity - The fully initialized activity instance
     */
    onReady?: (activity: ActivityInstance) => void | Promise<void>

    /**
     * Callback invoked when an error occurs during initialization.
     * @param error - The error that occurred
     */
    onError?: (error: ActivityError) => void
}

/**
 * The main Act-Vite activity instance returned by `createActivity()`.
 * This is your primary interface to the Discord environment.
 *
 * @since 0.1.0
 */
export interface ActivityInstance {
    /**
     * The raw Discord Embedded App SDK instance.
     * Use this for any functionality not covered by Act-Vite's abstractions.
     */
    sdk: DiscordSDK

    /**
     * The authenticated Discord user.
     * Available after `createActivity()` resolves.
     */
    user: ActivityUser

    /**
     * Information about the current Discord channel (voice channel or DM).
     * May be null if the activity is running outside a channel context.
     */
    channel: ActivityChannel | null

    /**
     * Information about the current Discord guild (server).
     * May be null if the activity is running in a DM.
     */
    guild: ActivityGuild | null

    /**
     * The list of participants currently in the activity.
     * Automatically updates when participants join or leave.
     */
    participants: ActivityParticipant[]

    /**
     * Subscribe to participant changes.
     * @param callback - Called whenever the participant list changes.
     * @returns An unsubscribe function.
     */
    onParticipantsChange: (
        callback: (participants: ActivityParticipant[]) => void,
    ) => () => void

    /**
     * Whether the activity is running inside Discord (true) or in a
     * development browser environment (false).
     */
    isEmbedded: boolean

    /**
     * The current Act-Vite configuration, with defaults applied.
     */
    config: Required<ActivityConfig>
}

/**
 * A Discord user participating in the activity.
 *
 * @since 0.1.0
 */
export interface ActivityUser {
    /** The user's unique Discord ID (snowflake). */
    id: string
    /** The user's display username. */
    username: string
    /** The user's discriminator (e.g. "0" for pomelo usernames). */
    discriminator: string
    /** The user's avatar hash, or null if they have no avatar. */
    avatar: string | null
    /** The user's global display name, if set. */
    globalName: string | null
    /** The URL to the user's avatar image. */
    avatarUrl: string
    /** Whether this user is a bot account. */
    bot: boolean
    /** The user's Nitro subscription type (0 = none, 1 = classic, 2 = nitro, 3 = basic). */
    premiumType: 0 | 1 | 2 | 3
}

/**
 * The Discord channel the activity is running in.
 *
 * @since 0.1.0
 */
export interface ActivityChannel {
    /** The channel's unique Discord ID (snowflake). */
    id: string
    /** The channel's name. */
    name: string
    /** The channel type (e.g., 2 for voice channel). */
    type: number
}

/**
 * The Discord guild (server) the activity is running in.
 *
 * @since 0.1.0
 */
export interface ActivityGuild {
    /** The guild's unique Discord ID (snowflake). */
    id: string
}

/**
 * A participant in the current activity session.
 *
 * @since 0.1.0
 */
export interface ActivityParticipant {
    /** The participant's Discord user information. */
    user: ActivityUser
    /** The URL to the participant's avatar image. */
    avatarUrl: string
}

/**
 * An error thrown or emitted by Act-Vite.
 * All Act-Vite errors include a machine-readable error code
 * and a link to the relevant documentation page.
 *
 * @since 0.1.0
 */
export class ActivityError extends Error {
    /** A machine-readable error code. */
    public readonly code: ActivityErrorCode
    /** A URL to the relevant documentation page. */
    public readonly docsUrl: string

    constructor(code: ActivityErrorCode, message: string) {
        super(`[actvite] ${message}\nDocs: https://actvite.dev/docs/errors#${code}`)
        this.name = 'ActivityError'
        this.code = code
        this.docsUrl = `https://actvite.dev/docs/errors#${code}`
    }
}

/**
 * Machine-readable error codes used by Act-Vite.
 *
 * @since 0.1.0
 */
export type ActivityErrorCode =
    | 'MISSING_CLIENT_ID'
    | 'AUTH_FAILED'
    | 'TOKEN_EXCHANGE_FAILED'
    | 'SDK_NOT_READY'
    | 'PARTICIPANTS_UNAVAILABLE'
    | 'INVALID_CONFIG'
    | 'NETWORK_ERROR'

/**
 * Internal state used during the initialization process.
 * Not part of the public API.
 * @internal
 */
export interface ActivityInitState {
    sdk: DiscordSDK
    accessToken: string
    auth: {
        user: {
            id: string
            username: string
            discriminator: string
            avatar: string | null
            global_name: string | null
            public_flags: number
            premium_type: number
            bot?: boolean
        }
    }
}
