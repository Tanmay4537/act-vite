// packages/actvite-multiplayer/src/types.ts

/**
 * Valid types for shared state values.
 *
 * @since 0.1.0
 */
export type StateValue = string | number | boolean | null | Record<string, unknown> | unknown[]

/**
 * Listener for a specific state key change.
 *
 * @since 0.1.0
 */
export type StateListener<T extends StateValue> = (value: T, previousValue: T) => void

/**
 * Listener for any state change.
 *
 * @since 0.1.0
 */
export type AnyStateListener = (key: string, value: StateValue) => void

/**
 * Configuration options for creating a shared state instance.
 *
 * @since 0.1.0
 */
export interface SharedStateOptions {
    /** The WebSocket URL to connect to for state synchronization. */
    wsUrl: string
    /** The room ID to join. Participants in the same room share state. */
    roomId: string
}

/**
 * A reactive shared state object that synchronizes across all activity participants.
 * Created by `createSharedState()`.
 *
 * @since 0.1.0
 */
export interface SharedState<T extends Record<string, StateValue>> {
    /**
     * Get the current value of a state key.
     * @param key - The state key to retrieve
     * @returns The current value
     */
    get<K extends keyof T>(key: K): T[K]

    /**
     * Set a state value and broadcast it to all participants.
     * @param key - The state key to update
     * @param value - The new value
     */
    set<K extends keyof T>(key: K, value: T[K]): void

    /**
     * Subscribe to changes for a specific key.
     * @param key - The state key to watch
     * @param listener - Called with the new and old values when the key changes
     * @returns An unsubscribe function
     */
    subscribe<K extends keyof T>(key: K, listener: StateListener<T[K]>): () => void

    /**
     * Subscribe to all state changes.
     * @param listener - Called with the key and new value on any change
     * @returns An unsubscribe function
     */
    subscribeAll(listener: AnyStateListener): () => void

    /**
     * Get the full current state snapshot.
     * @returns A frozen copy of the current state
     */
    getSnapshot(): Readonly<T>

    /**
     * Reset all state to the initial values.
     */
    reset(): void

    /**
     * Destroy this shared state instance and disconnect from the server.
     */
    destroy(): void
}

/**
 * A room in the multiplayer system.
 *
 * @since 0.1.0
 */
export interface Room {
    /** The unique room identifier. */
    id: string
    /** The set of participant IDs currently in the room. */
    participants: Set<string>
    /** The current state of the room. */
    state: Record<string, StateValue>
}

/**
 * Internal message format for WebSocket state sync.
 * @internal
 */
export interface StateMessage {
    type: 'state_update' | 'state_sync' | 'join' | 'leave'
    key?: string
    value?: StateValue
    state?: Record<string, StateValue>
    participantId?: string
    roomId?: string
}
