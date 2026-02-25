// packages/actvite-server/src/express.ts

import type { Request, Response, NextFunction } from 'express'
import { exchangeToken } from './index.js'

/**
 * Express middleware for handling the Discord Activity token exchange.
 *
 * Mount this at `POST /api/token` in your Express app.
 *
 * @param clientId - Your Discord Client ID (use `process.env.DISCORD_CLIENT_ID`)
 * @param clientSecret - Your Discord Client Secret (use `process.env.DISCORD_CLIENT_SECRET`)
 * @returns Express middleware handler
 *
 * @example
 * ```ts
 * import express from 'express'
 * import { activityTokenHandler } from 'actvite-server/express'
 *
 * const app = express()
 * app.use(express.json())
 *
 * app.post('/api/token', activityTokenHandler(
 *   process.env.DISCORD_CLIENT_ID!,
 *   process.env.DISCORD_CLIENT_SECRET!,
 * ))
 *
 * app.listen(3000)
 * ```
 *
 * @since 0.1.0
 */
export function activityTokenHandler(clientId: string, clientSecret: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { code } = req.body as { code?: string }

            if (!code || typeof code !== 'string') {
                res.status(400).json({
                    error: 'Missing or invalid "code" in request body.',
                    docs: 'https://actvite.dev/server/express#token-exchange',
                })
                return
            }

            const accessToken = await exchangeToken(code, clientId, clientSecret)
            res.json({ access_token: accessToken })
        } catch (err) {
            next(err)
        }
    }
}
