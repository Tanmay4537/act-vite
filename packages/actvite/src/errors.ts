// packages/actvite/src/errors.ts

import { ActivityError, type ActivityErrorCode } from './types.js'

type ErrorFactory = (details?: string) => ActivityError

const createErrorFactory = (code: ActivityErrorCode, baseMessage: string): ErrorFactory => {
    return (details?: string): ActivityError => {
        const message = details ? `${baseMessage}\n  → ${details}` : baseMessage
        return new ActivityError(code, message)
    }
}

/**
 * Pre-built error factories for all Act-Vite error conditions.
 * Each factory produces a descriptive, actionable error with documentation links.
 * @internal
 */
export const Errors = {
    /**
     * Thrown when `clientId` is missing from the configuration.
     */
    missingClientId: createErrorFactory(
        'MISSING_CLIENT_ID',
        'config.clientId is required but was not provided.\n' +
        '  → Add your Discord application\'s Client ID to createActivity({ clientId: "YOUR_ID" })\n' +
        '  → Find your Client ID at: https://discord.com/developers/applications',
    ),

    /**
     * Thrown when Discord OAuth2 authentication fails.
     */
    authFailed: createErrorFactory(
        'AUTH_FAILED',
        'Discord authentication failed.\n' +
        '  → Check that your clientId is correct\n' +
        '  → Ensure your URL mappings are configured in the Discord Developer Portal',
    ),

    /**
     * Thrown when the token exchange with the server fails.
     */
    tokenExchangeFailed: createErrorFactory(
        'TOKEN_EXCHANGE_FAILED',
        'Token exchange with your server failed.\n' +
        '  → Ensure your token exchange server is running\n' +
        '  → Check the tokenRoute option in your config\n' +
        '  → Your server must accept POST /api/token with { code } and return { access_token }',
    ),

    /**
     * Thrown when attempting to use the SDK before it is initialized.
     */
    sdkNotReady: createErrorFactory(
        'SDK_NOT_READY',
        'Attempted to use the Discord SDK before it was ready.\n' +
        '  → Always await createActivity() before accessing activity.sdk',
    ),

    /**
     * Thrown when the configuration object is invalid.
     */
    invalidConfig: createErrorFactory(
        'INVALID_CONFIG',
        'The configuration object passed to createActivity() is invalid.',
    ),

    /**
     * Thrown when a network request fails during initialization.
     */
    networkError: createErrorFactory(
        'NETWORK_ERROR',
        'A network request failed during activity initialization.\n' +
        '  → Check your internet connection\n' +
        '  → Ensure your development tunnel is running (actvite dev)',
    ),
}
