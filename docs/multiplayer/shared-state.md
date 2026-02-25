# Shared State

`createSharedState()` creates a reactive store that syncs across all activity participants.

## API

### `createSharedState(initialState, options)`

```ts
const state = createSharedState({
  score: 0,
  phase: 'waiting' as 'waiting' | 'playing' | 'ended',
}, {
  wsUrl: '/.proxy/ws',
  roomId: 'my-room',
})
```

### Methods

| Method | Description |
|--------|-------------|
| `get(key)` | Get the current value of a key |
| `set(key, value)` | Set a value and broadcast to all participants |
| `subscribe(key, listener)` | Watch a specific key for changes |
| `subscribeAll(listener)` | Watch all state changes |
| `getSnapshot()` | Get a frozen copy of all current state |
| `reset()` | Reset to initial values |
| `destroy()` | Disconnect and clean up |

### Subscribing to Changes

```ts
// Watch a specific key
const unsubscribe = state.subscribe('score', (newScore, oldScore) => {
  console.log(`Score changed from ${oldScore} to ${newScore}`)
})

// Watch all changes
state.subscribeAll((key, value) => {
  console.log(`${key} changed to ${value}`)
})

// Cleanup
unsubscribe()
```

### Auto-Reconnect

If the WebSocket connection drops, `createSharedState` automatically reconnects after 2 seconds.
