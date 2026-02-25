# Multiplayer Overview

If you're building a game, a drawing app, or anything where participants need to interact with each other in real-time, you need multiplayer.

`actvite-multiplayer` provides an instant, zero-config shared state system.

## The Mental Model

Think of it like a global Zustand or React context — except instead of just being available across your components, it's available across **everyone's screens in the same voice channel**.

If Player 1 updates the score, Player 2 sees it instantly.

## What It Does

- It provides a `SharedState` object on the client.
- It connects to a WebSocket server you run.
- It automatically places participants into the correct **room** based on their voice channel instance.
- It synchronizes state updates between everyone in that room.
- It provides late-joiners with the current state when they connect.

::: fun "How does the sync actually work?"
WebSockets. Beautiful, simple, slightly-terrifying-when-they-disconnect WebSockets. Act-Vite's multiplayer layer handles reconnection automatically, so you don't have to think about it. You just call `state.set('score', 100)` and everyone sees it. Magic? No. WebSockets. But close enough.
:::

## What It Doesn't Do

- **It is not an authoritative server.** It blindly accepts state updates from clients. If someone opens DevTools and changes their score to 999999, it will ruin the game. It is great for casual experiences with friends. Do not use it for a competitive esport.
- **It is not a physics engine.** If you need complex real-time physics prediction (like Rocket League), you need a dedicated game server (like Nakama or Colyseus).

## Minimal Example

Here's how stupidly simple it is on the client:

```tsx
import { useEffect, useState } from 'react'
import { createSharedState } from 'actvite-multiplayer'

export function ScoreBoard() {
  const [score, setScore] = useState(0)
  const [shared] = useState(() => createSharedState('ws://localhost:3001/ws'))

  useEffect(() => {
    // Listen for updates from anyone
    shared.on('score', (newScore) => {
      setScore(newScore)
    })
    
    return () => shared.disconnect()
  }, [])

  return (
    <div>
      <h1>Score: {score}</h1>
      <button onClick={() => shared.set('score', score + 1)}>
        Point!
      </button>
    </div>
  )
}
```

When you click "Point!", everyone in the channel sees the score increase immediately.

## Setting Up The Server

Remember that token exchange server you set up? We just attach a WebSocket server to it.

```ts
import { createServer } from 'http'
import express from 'express'
import { createMultiplayerServer } from 'actvite-multiplayer/server'

const app = express()
const server = createServer(app)

// Attach the multiplayer WebSocket server
createMultiplayerServer({ server, path: '/ws' })

server.listen(3001)
```

That's it. You now have a real-time multiplayer backend.

---

**What's next?** → [API Reference](/api/reference) for the complete method list.
