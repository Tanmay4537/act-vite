# Server Overview

To authenticate a Discord Activity, you need a server. 

Yes, really.

## Why a server?

When your Activity initializes, Discord gives it an OAuth2 authorization **code**. This code is useless on its own. It needs to be exchanged for an **access token**.

To make that exchange, you need your **Client Secret**.

::: fun "Can I skip the server and do it client-side?"
Technically yes. Practically, please don't. Your Client Secret would be visible in the browser's network tab to anyone who opens DevTools. And someone will. Add the four lines of server code. It's worth it.
:::

So, you need a server to securely hold your Client Secret, make the exchange with Discord, and send the token back to your frontend.

## Act-Vite Server Adapters

Act-Vite provides `actvite-server`, a tiny package with pre-built adapters for the three most popular Node.js web frameworks. They all do the exact same thing: expose a `POST /api/token` endpoint that handles the exchange.

Choose the one you prefer.

### Express

The classic. Most familiar, perfectly fine.

```ts
import express from 'express'
import { activityTokenHandler } from 'actvite-server/express'

const app = express()

// You just need this one line
app.post('/api/token', activityTokenHandler(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET))

app.listen(3001)
```

### Hono

The modern edge-native framework. Extremely lightweight.

```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { activityTokenHandler } from 'actvite-server/hono'

const app = new Hono()

app.post('/api/token', activityTokenHandler(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET))

serve({ fetch: app.fetch, port: 3001 })
```

### Fastify

The performance-focused choice.

```ts
import Fastify from 'fastify'
import { activityTokenPlugin } from 'actvite-server/fastify'

const fastify = Fastify()

fastify.register(activityTokenPlugin, {
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET
})

fastify.listen({ port: 3001 })
```

## How It Wires Up

1. Your frontend Vite dev server (e.g., `localhost:5173`) has a proxy rule set up in `vite.config.ts`.
2. When Act-Vite needs a token, it POSTs to `/.proxy/api/token`.
3. Vite proxies that request to your Node server (e.g., `localhost:3001/api/token`).
4. Your Node server talks to Discord, gets the token, and sends it back.

In production, you just host this server (e.g., on Render, Fly.io, or AWS) and point Discord's URL map directly at it.

---

**What's next?** → [Multiplayer Overview](/multiplayer/overview) to learn how to add real-time shared state.
