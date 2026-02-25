// packages/actvite/src/react/context.tsx

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ActivityInstance, ActivityConfig } from '../types.js'
import { createActivity } from '../activity.js'

interface ActivityContextValue {
    activity: ActivityInstance | null
    isLoading: boolean
    error: Error | null
}

const ActivityContext = createContext<ActivityContextValue | null>(null)

/**
 * Props for the `ActivityProvider` component.
 *
 * @since 0.1.0
 */
export interface ActivityProviderProps {
    /** Your Discord application's Client ID. */
    clientId: string
    /** Additional Act-Vite configuration options. */
    config?: Omit<ActivityConfig, 'clientId'>
    /** Content to render while the activity is initializing. */
    fallback?: ReactNode
    /** Content to render if initialization fails. */
    errorFallback?: (error: Error) => ReactNode
    /** Your application's component tree. */
    children: ReactNode
}

/**
 * Provides an Act-Vite activity context to your React application.
 * Wrap your app with this component to access activity data via hooks.
 *
 * @param props - Provider configuration props
 * @returns A React element wrapping children with activity context
 *
 * @example
 * ```tsx
 * import { ActivityProvider } from 'actvite/react'
 *
 * function App() {
 *   return (
 *     <ActivityProvider clientId="1234567890" fallback={<div>Loading...</div>}>
 *       <Game />
 *     </ActivityProvider>
 *   )
 * }
 * ```
 *
 * @since 0.1.0
 */
export function ActivityProvider({
    clientId,
    config,
    fallback = null,
    errorFallback,
    children,
}: ActivityProviderProps) {
    const [activity, setActivity] = useState<ActivityInstance | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let cancelled = false

        createActivity({ clientId, ...config })
            .then((instance) => {
                if (!cancelled) {
                    setActivity(instance)
                    setIsLoading(false)
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error(String(err)))
                    setIsLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [clientId])

    if (isLoading) return <>{fallback}</>
    if (error) return <>{errorFallback ? errorFallback(error) : null}</>

    return (
        <ActivityContext.Provider value={{ activity, isLoading, error }}>
            {children}
        </ActivityContext.Provider>
    )
}

/**
 * Internal hook to access the activity context.
 * @internal
 */
export function useActivityContext(): ActivityContextValue {
    const ctx = useContext(ActivityContext)
    if (!ctx) {
        throw new Error(
            '[actvite] useActivity() must be called inside an <ActivityProvider>.\n' +
            '  → Wrap your app with <ActivityProvider clientId="YOUR_CLIENT_ID">',
        )
    }
    return ctx
}
