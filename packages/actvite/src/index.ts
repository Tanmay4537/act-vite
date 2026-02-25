// packages/actvite/src/index.ts

/**
 * @packageDocumentation
 * Act-Vite — The Discord Activity framework.
 * Build embedded apps with confidence.
 *
 * @see https://actvite.dev
 */

export { createActivity } from './activity.js'
export { isEmbedded } from './proxy.js'
export { ActivityError } from './types.js'
export type {
    ActivityConfig,
    ActivityInstance,
    ActivityUser,
    ActivityChannel,
    ActivityGuild,
    ActivityParticipant,
    ActivityErrorCode,
} from './types.js'
