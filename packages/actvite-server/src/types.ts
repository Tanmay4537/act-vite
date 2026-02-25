// packages/actvite-server/src/types.ts

/**
 * Configuration for the Act-Vite server-side token exchange.
 *
 * @since 0.1.0
 */
export interface ServerConfig {
    /**
     * Your Discord application's Client ID.
     * Should be loaded from environment variables: `process.env.DISCORD_CLIENT_ID`
     */
    clientId: string

    /**
     * Your Discord application's Client Secret.
     * Should be loaded from environment variables: `process.env.DISCORD_CLIENT_SECRET`
     * ⚠️ Never expose this in client-side code!
     */
    clientSecret: string
}
