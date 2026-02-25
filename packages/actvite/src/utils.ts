// packages/actvite/src/utils.ts

/**
 * Builds a Discord CDN avatar URL for a user.
 *
 * @param userId - The user's Discord snowflake ID
 * @param avatar - The user's avatar hash, or null for the default avatar
 * @returns The full URL to the user's avatar image
 *
 * @example
 * ```ts
 * const url = buildAvatarUrl('123456789', 'abc123')
 * // => "https://cdn.discordapp.com/avatars/123456789/abc123.png?size=256"
 * ```
 *
 * @since 0.1.0
 * @internal
 */
export function buildAvatarUrl(userId: string, avatar: string | null): string {
    if (!avatar) {
        const defaultIndex = Number(BigInt(userId) >> 22n) % 6
        return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`
    }
    const ext = avatar.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${ext}?size=256`
}

/**
 * Creates a noop function.
 * @internal
 */
export function noop(): void {
    // intentionally empty
}
