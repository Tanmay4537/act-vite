// packages/actvite/src/react/index.ts

/**
 * React bindings for Act-Vite.
 *
 * @packageDocumentation
 */

export { ActivityProvider } from './context.js'
export type { ActivityProviderProps } from './context.js'
export {
    useActivity,
    useCurrentUser,
    useParticipants,
    useIsEmbedded,
    useChannel,
    useGuild,
} from './hooks.js'
