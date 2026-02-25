# Rooms

The multiplayer server organizes participants into rooms. Each room has its own independent state.

## Room Management

Rooms are created automatically when participants connect with a `room` query parameter:

```
ws://localhost:3001/ws?room=my-room
```

Rooms are automatically deleted when the last participant disconnects.

## RoomManager

The `RoomManager` class provides server-side room management:

```ts
import { RoomManager } from 'actvite-multiplayer'

const rooms = new RoomManager()

// Get or create a room
const room = rooms.getOrCreate('my-room')

// Add/remove participants
rooms.join('my-room', 'user-123')
rooms.leave('my-room', 'user-123')

// Manage state
rooms.setState('my-room', 'score', 100)
const state = rooms.getState('my-room')

// List active rooms
const activeRooms = rooms.listRooms()
```

## Room Lifecycle

1. **Created** — When the first participant connects with a room ID
2. **Active** — Participants can join, leave, and update state
3. **Deleted** — Automatically when the last participant leaves
