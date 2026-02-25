// packages/actvite-multiplayer/src/server.ts

import type { IncomingMessage } from 'http'
import type { Server as HTTPServer } from 'http'
import { RoomManager } from './room.js'
import type { StateMessage } from './types.js'

/**
 * Options for creating the multiplayer WebSocket server.
 *
 * @since 0.1.0
 */
export interface MultiplayerServerOptions {
    /** The HTTP server to attach the WebSocket server to. */
    server: HTTPServer
    /** Optional path to listen on. Defaults to `/ws`. */
    path?: string
}

/**
 * Creates a multiplayer WebSocket server that handles state synchronization
 * between activity participants.
 *
 * This server manages rooms, broadcasts state updates, and provides
 * new participants with the current state snapshot when they join.
 *
 * @param options - Server configuration
 * @returns An object with the room manager and a cleanup function
 *
 * @example
 * ```ts
 * import { createServer } from 'http'
 * import { createMultiplayerServer } from 'actvite-multiplayer/server'
 *
 * const httpServer = createServer()
 *
 * const { rooms, close } = createMultiplayerServer({
 *   server: httpServer,
 *   path: '/ws',
 * })
 *
 * httpServer.listen(3001, () => {
 *   console.log('Multiplayer server running on port 3001')
 * })
 * ```
 *
 * @since 0.1.0
 */
export async function createMultiplayerServer(options: MultiplayerServerOptions) {
    // Dynamically import ws to keep it as an optional peer dependency
    const { WebSocketServer, WebSocket } = await import('ws')

    const rooms = new RoomManager()
    const path = options.path ?? '/ws'

    const wss = new WebSocketServer({ server: options.server, path })

    // Track which room each client belongs to
    const clientRooms = new Map<InstanceType<typeof WebSocket>, string>()
    const clientIds = new Map<InstanceType<typeof WebSocket>, string>()

    wss.on('connection', (ws: InstanceType<typeof WebSocket>, req: IncomingMessage) => {
        const url = new URL(req.url ?? '/', `http://localhost`)
        const roomId = url.searchParams.get('room') ?? 'default'
        const participantId = Math.random().toString(36).slice(2, 10)

        clientRooms.set(ws, roomId)
        clientIds.set(ws, participantId)
        rooms.join(roomId, participantId)

        // Send current state to the new participant
        const currentState = rooms.getState(roomId)
        if (Object.keys(currentState).length > 0) {
            ws.send(
                JSON.stringify({
                    type: 'state_sync',
                    state: currentState,
                } as StateMessage),
            )
        }

        ws.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
            try {
                const msg = JSON.parse(data.toString()) as StateMessage

                if (msg.type === 'state_update' && msg.key !== undefined && msg.value !== undefined) {
                    const targetRoom = msg.roomId ?? roomId
                    rooms.setState(targetRoom, msg.key, msg.value)

                    // Broadcast to all other clients in the same room
                    wss.clients.forEach((client) => {
                        if (
                            client !== ws &&
                            client.readyState === WebSocket.OPEN &&
                            clientRooms.get(client as InstanceType<typeof WebSocket>) === targetRoom
                        ) {
                            client.send(
                                JSON.stringify({
                                    type: 'state_update',
                                    key: msg.key,
                                    value: msg.value,
                                } as StateMessage),
                            )
                        }
                    })
                }
            } catch {
                // Ignore malformed messages
            }
        })

        ws.on('close', () => {
            const pId = clientIds.get(ws)
            if (pId) {
                rooms.leave(roomId, pId)
            }
            clientRooms.delete(ws)
            clientIds.delete(ws)
        })
    })

    return {
        /** The room manager instance for inspecting room state. */
        rooms,
        /** The underlying WebSocketServer instance. */
        wss,
        /** Close the WebSocket server. */
        close: () => {
            wss.close()
        },
    }
}
