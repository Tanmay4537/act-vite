// packages/actvite-server/src/hono.ts

import type { Context } from 'hono'
import { exchangeToken } from './index.js'

/**
 * Hono route handler for the Discord Activity token exchange.
 *
 * @param clientId - Your Discord Client ID (use `process.env.DISCORD_CLIENT_ID`)
 * @param clientSecret - Your Discord Client Secret (use `process.env.DISCORD_CLIENT_SECRET`)
 * @returns Hono route handler
 *
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * import { activityTokenHandler } from 'actvite-server/hono'
 *
 * const app = new Hono()
 *
 * app.post('/api/token', activityTokenHandler(
 *   process.env.DISCORD_CLIENT_ID!,
 *   process.env.DISCORD_CLIENT_SECRET!,
 * ))
 *
 * export default app
 * ```
 *
 * @since 0.1.0
 */
export function activityTokenHandler(clientId: string, clientSecret: string) {
    return async (c: Context): Promise<Response> => {
        const body = await c.req.json<{ code?: string }>()

        if (!body.code || typeof body.code !== 'string') {
            return c.json(
                {
                    error: 'Missing or invalid "code" in request body.',
                    docs: 'https://actvite.dev/server/hono#token-exchange',
                },
                400,
            )
        }

        const accessToken = await exchangeToken(body.code, clientId, clientSecret)
        return c.json({ access_token: accessToken })
    }
}
