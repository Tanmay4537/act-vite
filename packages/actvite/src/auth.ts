// packages/actvite/src/auth.ts

import type { DiscordSDK } from '@discord/embedded-app-sdk'
import { Errors } from './errors.js'
import type { ActivityInitState, ActivityConfig } from './types.js'

/**
 * Performs the full OAuth2 authentication flow for a Discord Activity.
 *
 * This handles:
 * 1. Waiting for the Discord SDK to be ready
 * 2. Running the OAuth2 authorization flow
 * 3. Exchanging the code for an access token via your server
 * 4. Authenticating the SDK with the access token
 *
 * @param sdk - The initialized Discord SDK instance
 * @param config - The resolved activity configuration
 * @returns The initialized auth state including user info and access token
 *
 * @since 0.1.0
 * @internal
 */
export async function authenticate(
    sdk: DiscordSDK,
    config: Required<ActivityConfig>,
): Promise<ActivityInitState> {
    // Step 1: Wait for the SDK to be ready
    await sdk.ready()

    if (!config.disableConsoleLog) {
        console.log('[actvite] SDK ready, starting authentication...')
    }

    // Step 2: Run the OAuth2 authorization flow
    let code: string
    try {
        const response = await sdk.commands.authorize({
            client_id: config.clientId,
            response_type: 'code',
            state: '',
            prompt: 'none',
            scope: config.scope as Parameters<typeof sdk.commands.authorize>[0]['scope'],
        })
        code = response.code
    } catch (err) {
        throw Errors.authFailed(err instanceof Error ? err.message : String(err))
    }

    // Step 3: Exchange code for access token via your server
    let accessToken: string
    try {
        const tokenResponse = await fetch(config.tokenRoute, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })

        if (!tokenResponse.ok) {
            throw new Error(`Server responded with status ${tokenResponse.status}`)
        }

        const tokenData = (await tokenResponse.json()) as { access_token: string }
        accessToken = tokenData.access_token
    } catch (err) {
        throw Errors.tokenExchangeFailed(err instanceof Error ? err.message : String(err))
    }

    // Step 4: Authenticate the SDK
    let auth: ActivityInitState['auth']
    try {
        auth = await sdk.commands.authenticate({ access_token: accessToken })
    } catch (err) {
        throw Errors.authFailed(err instanceof Error ? err.message : String(err))
    }

    if (!config.disableConsoleLog) {
        console.log(`[actvite] Authenticated as ${auth.user.username}`)
    }

    return { sdk, accessToken, auth }
}
