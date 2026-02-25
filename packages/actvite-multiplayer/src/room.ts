// packages/actvite-multiplayer/src/room.ts

import type { Room, StateValue } from './types.js'

/**
 * In-memory room manager for tracking multiplayer rooms.
 * Used by the WebSocket server helper.
 *
 * @since 0.1.0
 */
export class RoomManager {
    private rooms = new Map<string, Room>()

    /**
     * Get or create a room by ID.
     *
     * @param roomId - The room identifier
     * @returns The room instance
     *
     * @example
     * ```ts
     * const manager = new RoomManager()
     * const room = manager.getOrCreate('my-room')
     * ```
     *
     * @since 0.1.0
     */
    getOrCreate(roomId: string): Room {
        let room = this.rooms.get(roomId)
        if (!room) {
            room = {
                id: roomId,
                participants: new Set(),
                state: {},
            }
            this.rooms.set(roomId, room)
        }
        return room
    }

    /**
     * Get a room by ID, or null if it doesn't exist.
     *
     * @param roomId - The room identifier
     * @returns The room instance or null
     *
     * @since 0.1.0
     */
    get(roomId: string): Room | null {
        return this.rooms.get(roomId) ?? null
    }

    /**
     * Add a participant to a room.
     *
     * @param roomId - The room identifier
     * @param participantId - The participant's unique ID
     * @returns The updated room
     *
     * @since 0.1.0
     */
    join(roomId: string, participantId: string): Room {
        const room = this.getOrCreate(roomId)
        room.participants.add(participantId)
        return room
    }

    /**
     * Remove a participant from a room.
     * If the room is empty after removal, it is deleted.
     *
     * @param roomId - The room identifier
     * @param participantId - The participant's unique ID
     *
     * @since 0.1.0
     */
    leave(roomId: string, participantId: string): void {
        const room = this.rooms.get(roomId)
        if (!room) return

        room.participants.delete(participantId)

        // Clean up empty rooms
        if (room.participants.size === 0) {
            this.rooms.delete(roomId)
        }
    }

    /**
     * Update a state value in a room.
     *
     * @param roomId - The room identifier
     * @param key - The state key to update
     * @param value - The new value
     *
     * @since 0.1.0
     */
    setState(roomId: string, key: string, value: StateValue): void {
        const room = this.getOrCreate(roomId)
        room.state[key] = value
    }

    /**
     * Get the full state snapshot for a room.
     *
     * @param roomId - The room identifier
     * @returns The current room state, or empty object if room doesn't exist
     *
     * @since 0.1.0
     */
    getState(roomId: string): Record<string, StateValue> {
        return this.rooms.get(roomId)?.state ?? {}
    }

    /**
     * Get all active room IDs.
     *
     * @returns Array of active room IDs
     *
     * @since 0.1.0
     */
    listRooms(): string[] {
        return Array.from(this.rooms.keys())
    }

    /**
     * Delete a room and all its state.
     *
     * @param roomId - The room identifier
     *
     * @since 0.1.0
     */
    deleteRoom(roomId: string): void {
        this.rooms.delete(roomId)
    }
}
