// packages/actvite-server/src/fastify.ts

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { exchangeToken } from './index.js'

/**
 * Fastify plugin for handling the Discord Activity token exchange.
 *
 * @param clientId - Your Discord Client ID (use `process.env.DISCORD_CLIENT_ID`)
 * @param clientSecret - Your Discord Client Secret (use `process.env.DISCORD_CLIENT_SECRET`)
 * @returns A Fastify plugin function that registers the `/api/token` route
 *
 * @example
 * ```ts
 * import Fastify from 'fastify'
 * import { activityTokenPlugin } from 'actvite-server/fastify'
 *
 * const fastify = Fastify()
 *
 * fastify.register(activityTokenPlugin(
 *   process.env.DISCORD_CLIENT_ID!,
 *   process.env.DISCORD_CLIENT_SECRET!,
 * ))
 *
 * fastify.listen({ port: 3000 })
 * ```
 *
 * @since 0.1.0
 */
export function activityTokenPlugin(clientId: string, clientSecret: string) {
    return async (fastify: FastifyInstance): Promise<void> => {
        fastify.post(
            '/api/token',
            async (
                request: FastifyRequest<{ Body: { code?: string } }>,
                reply: FastifyReply,
            ) => {
                const { code } = request.body

                if (!code || typeof code !== 'string') {
                    return reply.status(400).send({
                        error: 'Missing or invalid "code" in request body.',
                        docs: 'https://actvite.dev/server/fastify#token-exchange',
                    })
                }

                const accessToken = await exchangeToken(code, clientId, clientSecret)
                return reply.send({ access_token: accessToken })
            },
        )
    }
}
