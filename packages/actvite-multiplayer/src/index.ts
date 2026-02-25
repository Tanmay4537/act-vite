// packages/actvite-multiplayer/src/index.ts

/**
 * @packageDocumentation
 * Act-Vite Multiplayer — Shared state layer for Discord Activities.
 *
 * @see https://actvite.dev/multiplayer/overview
 */

export { createSharedState } from './state.js'
export { RoomManager } from './room.js'
export type {
    SharedState,
    SharedStateOptions,
    StateValue,
    StateListener,
    AnyStateListener,
    Room,
} from './types.js'
