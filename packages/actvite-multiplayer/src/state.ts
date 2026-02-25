// packages/actvite-multiplayer/src/state.ts

import type {
    SharedState,
    SharedStateOptions,
    StateValue,
    StateListener,
    AnyStateListener,
    StateMessage,
} from './types.js'

/**
 * Creates a reactive shared state store for your Discord Activity.
 *
 * State changes are automatically synchronized across all participants
 * via WebSocket. The state is ephemeral — it resets when all participants leave.
 *
 * @param initialState - The initial values for all state keys
 * @param options - Configuration for the WebSocket connection
 * @returns A reactive `SharedState` instance
 *
 * @example
 * ```ts
 * import { createActivity } from 'actvite'
 * import { createSharedState } from 'actvite-multiplayer'
 *
 * const activity = await createActivity({ clientId: '12345' })
 *
 * const state = createSharedState({
 *   score: 0,
 *   round: 1,
 *   phase: 'waiting' as 'waiting' | 'playing' | 'ended',
 * }, {
 *   wsUrl: '/.proxy/ws',
 *   roomId: activity.channel?.id ?? 'default',
 * })
 *
 * state.set('score', 100)
 * state.subscribe('round', (newRound) => console.log('Round:', newRound))
 * ```
 *
 * @since 0.1.0
 */
export function createSharedState<T extends Record<string, StateValue>>(
    initialState: T,
    options: SharedStateOptions,
): SharedState<T> {
    let state = { ...initialState }
    const keyListeners = new Map<keyof T, Set<StateListener<StateValue>>>()
    const allListeners = new Set<AnyStateListener>()
    let ws: WebSocket | null = null
    let destroyed = false
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

    // Connect to WebSocket
    const connect = () => {
        if (destroyed) return

        try {
            ws = new WebSocket(`${options.wsUrl}?room=${options.roomId}`)

            ws.onopen = () => {
                // Request current state from server
                ws?.send(JSON.stringify({ type: 'join', roomId: options.roomId }))
            }

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data as string) as StateMessage

                    if (msg.type === 'state_update' && msg.key !== undefined && msg.value !== undefined) {
                        const prev = state[msg.key as keyof T]
                        state = { ...state, [msg.key]: msg.value }

                        // Notify key-specific listeners
                        const listeners = keyListeners.get(msg.key as keyof T)
                        listeners?.forEach((l) => l(msg.value as StateValue, prev as StateValue))

                        // Notify all-listeners
                        allListeners.forEach((l) => l(msg.key!, msg.value as StateValue))
                    } else if (msg.type === 'state_sync' && msg.state) {
                        // Full state sync from server
                        const prevState = { ...state }
                        state = { ...initialState, ...msg.state } as T

                        // Notify listeners for each changed key
                        for (const key of Object.keys(state)) {
                            const prev = prevState[key as keyof T]
                            const curr = state[key as keyof T]
                            if (prev !== curr) {
                                const listeners = keyListeners.get(key as keyof T)
                                listeners?.forEach((l) => l(curr as StateValue, prev as StateValue))
                                allListeners.forEach((l) => l(key, curr as StateValue))
                            }
                        }
                    }
                } catch {
                    // Ignore malformed messages
                }
            }

            ws.onclose = () => {
                if (!destroyed) {
                    // Attempt reconnect after 2 seconds
                    reconnectTimeout = setTimeout(connect, 2000)
                }
            }

            ws.onerror = () => {
                ws?.close()
            }
        } catch (err) {
            console.warn('[actvite-multiplayer] WebSocket connection failed:', err)
            if (!destroyed) {
                reconnectTimeout = setTimeout(connect, 2000)
            }
        }
    }

    connect()

    const broadcast = (key: string, value: StateValue) => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'state_update',
                    key,
                    value,
                    roomId: options.roomId,
                } satisfies StateMessage),
            )
        }
    }

    const sharedState: SharedState<T> = {
        get(key) {
            return state[key]
        },

        set(key, value) {
            const prev = state[key]
            state = { ...state, [key]: value }

            // Notify local listeners immediately
            const listeners = keyListeners.get(key)
            listeners?.forEach((l) => l(value as StateValue, prev as StateValue))
            allListeners.forEach((l) => l(key as string, value as StateValue))

            // Broadcast to other participants
            broadcast(key as string, value as StateValue)
        },

        subscribe(key, listener) {
            if (!keyListeners.has(key)) keyListeners.set(key, new Set())
            keyListeners.get(key)!.add(listener as StateListener<StateValue>)
            return () => {
                keyListeners.get(key)?.delete(listener as StateListener<StateValue>)
            }
        },

        subscribeAll(listener) {
            allListeners.add(listener)
            return () => {
                allListeners.delete(listener)
            }
        },

        getSnapshot() {
            return Object.freeze({ ...state }) as Readonly<T>
        },

        reset() {
            for (const key of Object.keys(initialState)) {
                sharedState.set(key as keyof T, initialState[key as keyof T]!)
            }
        },

        destroy() {
            destroyed = true
            if (reconnectTimeout) clearTimeout(reconnectTimeout)
            ws?.close()
            ws = null
            keyListeners.clear()
            allListeners.clear()
        },
    }

    return sharedState
}
