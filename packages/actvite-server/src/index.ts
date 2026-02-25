// packages/actvite-server/src/index.ts

/**
 * @packageDocumentation
 * Act-Vite Server — Token exchange helpers for Discord Activity authentication.
 *
 * @see https://actvite.dev/server/overview
 */

/**
 * Performs the Discord OAuth2 token exchange.
 * Swaps a short-lived authorization code for an access token.
 *
 * @param code - The authorization code from the Discord OAuth2 flow
 * @param clientId - Your Discord application's Client ID
 * @param clientSecret - Your Discord application's Client Secret (keep this server-side only!)
 * @returns The Discord access token
 *
 * @example
 * ```ts
 * import { exchangeToken } from 'actvite-server'
 *
 * const token = await exchangeToken(code, clientId, clientSecret)
 * ```
 *
 * @since 0.1.0
 */
export async function exchangeToken(
    code: string,
    clientId: string,
    clientSecret: string,
): Promise<string> {
    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(
            `[actvite-server] Token exchange failed (${response.status}): ${error}\n` +
            '  → Check your DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET environment variables\n' +
            '  → Docs: https://actvite.dev/server/overview#token-exchange',
        )
    }

    const data = (await response.json()) as { access_token: string }
    return data.access_token
}

export type { ServerConfig } from './types.js'
