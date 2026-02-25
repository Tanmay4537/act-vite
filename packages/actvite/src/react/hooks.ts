// packages/actvite/src/react/hooks.ts

import { useState, useEffect } from 'react'
import { useActivityContext } from './context.js'
import type {
    ActivityInstance,
    ActivityParticipant,
    ActivityUser,
    ActivityChannel,
    ActivityGuild,
} from '../types.js'

/**
 * Returns the full Act-Vite activity instance.
 * Must be used inside an `<ActivityProvider>`.
 *
 * @returns The current `ActivityInstance`
 *
 * @example
 * ```tsx
 * function Game() {
 *   const activity = useActivity()
 *   return <div>Hello, {activity.user.username}!</div>
 * }
 * ```
 *
 * @since 0.1.0
 */
export function useActivity(): ActivityInstance {
    const { activity } = useActivityContext()
    if (!activity) {
        throw new Error(
            '[actvite] Activity is not initialized yet.\n' +
            '  → Make sure <ActivityProvider> has finished loading before accessing the activity.',
        )
    }
    return activity
}

/**
 * Returns the currently authenticated Discord user.
 *
 * @returns The authenticated `ActivityUser`
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const user = useCurrentUser()
 *   return (
 *     <div>
 *       <img src={user.avatarUrl} alt={user.username} />
 *       <span>{user.globalName ?? user.username}</span>
 *     </div>
 *   )
 * }
 * ```
 *
 * @since 0.1.0
 */
export function useCurrentUser(): ActivityUser {
    return useActivity().user
}

/**
 * Returns the live list of participants in the current activity session.
 * Automatically re-renders when participants join or leave.
 *
 * @returns An array of `ActivityParticipant` objects
 *
 * @example
 * ```tsx
 * function Lobby() {
 *   const participants = useParticipants()
 *   return (
 *     <ul>
 *       {participants.map(p => (
 *         <li key={p.user.id}>{p.user.username}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @since 0.1.0
 */
export function useParticipants(): ActivityParticipant[] {
    const activity = useActivity()
    const [participants, setParticipants] = useState<ActivityParticipant[]>(activity.participants)

    useEffect(() => {
        const unsubscribe = activity.onParticipantsChange(setParticipants)
        return unsubscribe
    }, [activity])

    return participants
}

/**
 * Returns whether the activity is currently running inside Discord.
 * Useful for conditionally showing development-only UI.
 *
 * @returns `true` if running inside the Discord iframe, `false` otherwise
 *
 * @example
 * ```tsx
 * function DevTools() {
 *   const isEmbedded = useIsEmbedded()
 *   if (isEmbedded) return null
 *   return <DevPanel />
 * }
 * ```
 *
 * @since 0.1.0
 */
export function useIsEmbedded(): boolean {
    return useActivity().isEmbedded
}

/**
 * Returns the current Discord channel the activity is running in.
 * May be null if channel info is unavailable.
 *
 * @returns The current `ActivityChannel` or null
 *
 * @since 0.1.0
 */
export function useChannel(): ActivityChannel | null {
    return useActivity().channel
}

/**
 * Returns the current Discord guild (server) the activity is running in.
 * May be null for DM activities.
 *
 * @returns The current `ActivityGuild` or null
 *
 * @since 0.1.0
 */
export function useGuild(): ActivityGuild | null {
    return useActivity().guild
}
