// packages/actvite/src/proxy.ts

/**
 * Determines if the current environment is an embedded Discord iframe.
 * Uses the presence of specific URL parameters that Discord injects.
 *
 * @returns `true` if running inside the Discord Activity iframe, `false` otherwise
 *
 * @example
 * ```ts
 * import { isEmbedded } from 'actvite'
 *
 * if (isEmbedded()) {
 *   console.log('Running inside Discord!')
 * }
 * ```
 *
 * @since 0.1.0
 */
export function isEmbedded(): boolean {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    return params.has('frame_id') || params.has('instance_id')
}

/**
 * Patches the global fetch to route requests through Discord's iframe proxy.
 * This is required for making API calls from within a Discord Activity.
 *
 * Discord Activities run inside a sandboxed iframe. All external requests
 * must be routed through Discord's proxy at `https://INSTANCE_ID.discordsays.com/.proxy/`.
 *
 * Act-Vite automatically calls this during `createActivity()`. You should
 * not need to call this manually.
 *
 * @param mappings - Array of URL prefix→target mappings to apply
 * @internal
 */
export function patchUrlMappings(mappings: Array<{ prefix: string; target: string }>): void {
    if (typeof window === 'undefined') return

    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

        for (const mapping of mappings) {
            if (url.startsWith(mapping.target)) {
                const patched = url.replace(mapping.target, mapping.prefix)
                const patchedInput =
                    typeof input === 'string'
                        ? patched
                        : input instanceof URL
                            ? new URL(patched)
                            : new Request(patched, input)
                return originalFetch(patchedInput, init)
            }
        }

        return originalFetch(input, init)
    }
}
