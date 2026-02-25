// packages/actvite/src/vue/composables.ts

import { ref, onMounted, onUnmounted, readonly, type Ref } from 'vue'
import type { ActivityInstance, ActivityParticipant, ActivityConfig } from '../types.js'
import { createActivity } from '../activity.js'

/**
 * Vue composable for initializing and accessing an Act-Vite activity.
 *
 * @param config - Activity configuration options
 * @returns Reactive refs for the activity instance, loading state, and error
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useActivity } from 'actvite/vue'
 *
 * const { activity, isLoading, error } = useActivity({ clientId: '12345' })
 * </script>
 *
 * <template>
 *   <div v-if="isLoading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <div v-else>Hello, {{ activity?.user.username }}!</div>
 * </template>
 * ```
 *
 * @since 0.1.0
 */
export function useActivity(config: ActivityConfig) {
    const activity = ref<ActivityInstance | null>(null)
    const isLoading = ref(true)
    const error = ref<Error | null>(null)

    onMounted(async () => {
        try {
            activity.value = await createActivity(config)
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err))
        } finally {
            isLoading.value = false
        }
    })

    return {
        activity: readonly(activity) as Ref<ActivityInstance | null>,
        isLoading: readonly(isLoading) as Ref<boolean>,
        error: readonly(error) as Ref<Error | null>,
    }
}

/**
 * Vue composable that returns the live participant list.
 * Automatically updates when participants join or leave.
 *
 * @param activity - A reactive ref to the activity instance from `useActivity()`
 * @returns A reactive readonly ref containing the current participant list
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useActivity, useParticipants } from 'actvite/vue'
 *
 * const { activity } = useActivity({ clientId: '12345' })
 * const participants = useParticipants(activity)
 * </script>
 *
 * <template>
 *   <ul>
 *     <li v-for="p in participants" :key="p.user.id">{{ p.user.username }}</li>
 *   </ul>
 * </template>
 * ```
 *
 * @since 0.1.0
 */
export function useParticipants(activity: Ref<ActivityInstance | null>) {
    const participants = ref<ActivityParticipant[]>([])
    let unsubscribe: (() => void) | null = null

    const setup = () => {
        if (!activity.value) return
        participants.value = activity.value.participants
        unsubscribe = activity.value.onParticipantsChange((p) => {
            participants.value = p
        })
    }

    onMounted(setup)
    onUnmounted(() => unsubscribe?.())

    return readonly(participants) as Ref<ActivityParticipant[]>
}
