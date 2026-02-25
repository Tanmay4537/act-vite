// packages/actvite/src/svelte/stores.ts

import type { ActivityInstance, ActivityParticipant, ActivityConfig } from '../types.js'
import { createActivity } from '../activity.js'

/**
 * Svelte-compatible store interface.
 * Matches Svelte's store contract for use with the `$` prefix syntax.
 *
 * @since 0.1.0
 */
export interface Readable<T> {
    subscribe: (run: (value: T) => void) => () => void
}

/**
 * The value held by the activity store.
 *
 * @since 0.1.0
 */
export interface ActivityStoreValue {
    /** The activity instance, or null if not yet initialized. */
    activity: ActivityInstance | null
    /** Whether the activity is still loading. */
    isLoading: boolean
    /** An error that occurred during initialization, or null. */
    error: Error | null
}

/**
 * Creates a Svelte-compatible readable store for the Act-Vite activity.
 *
 * @param config - Activity configuration options
 * @returns A readable store that emits `{ activity, isLoading, error }` values
 *
 * @example
 * ```svelte
 * <script>
 *   import { createActivityStore } from 'actvite/svelte'
 *
 *   const activity = createActivityStore({ clientId: '12345' })
 * </script>
 *
 * {#if $activity.isLoading}
 *   <p>Loading...</p>
 * {:else if $activity.error}
 *   <p>Error: {$activity.error.message}</p>
 * {:else}
 *   <p>Hello, {$activity.activity?.user.username}!</p>
 * {/if}
 * ```
 *
 * @since 0.1.0
 */
export function createActivityStore(config: ActivityConfig): Readable<ActivityStoreValue> {
    const subscribers = new Set<(value: ActivityStoreValue) => void>()
    let value: ActivityStoreValue = { activity: null, isLoading: true, error: null }

    const notify = () => {
        subscribers.forEach((fn) => fn(value))
    }

    // Initialize asynchronously
    createActivity(config)
        .then((instance) => {
            value = { activity: instance, isLoading: false, error: null }
            notify()
        })
        .catch((err: unknown) => {
            value = {
                activity: null,
                isLoading: false,
                error: err instanceof Error ? err : new Error(String(err)),
            }
            notify()
        })

    return {
        subscribe(run) {
            subscribers.add(run)
            run(value)
            return () => {
                subscribers.delete(run)
            }
        },
    }
}

/**
 * Creates a Svelte-compatible readable store that tracks activity participants.
 *
 * @param activity - The activity instance
 * @returns A readable store emitting the current participant list
 *
 * @example
 * ```svelte
 * <script>
 *   import { createParticipantsStore } from 'actvite/svelte'
 *
 *   // After activity is initialized:
 *   const participants = createParticipantsStore(activityInstance)
 * </script>
 *
 * {#each $participants as p}
 *   <div>{p.user.username}</div>
 * {/each}
 * ```
 *
 * @since 0.1.0
 */
export function createParticipantsStore(
    activity: ActivityInstance,
): Readable<ActivityParticipant[]> {
    const subscribers = new Set<(value: ActivityParticipant[]) => void>()
    let currentParticipants = activity.participants

    activity.onParticipantsChange((participants) => {
        currentParticipants = participants
        subscribers.forEach((fn) => fn(currentParticipants))
    })

    return {
        subscribe(run) {
            subscribers.add(run)
            run(currentParticipants)
            return () => {
                subscribers.delete(run)
            }
        },
    }
}
