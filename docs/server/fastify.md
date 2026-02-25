# Fastify

## Setup

```ts
import Fastify from 'fastify'
import { activityTokenPlugin } from 'actvite-server/fastify'

const fastify = Fastify()

fastify.register(activityTokenPlugin(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
))

fastify.listen({ port: 3001 })
```

## `activityTokenPlugin(clientId, clientSecret)`

Creates a Fastify plugin that registers a `POST /api/token` route.

**Parameters:**
- `clientId` — Your Discord Client ID
- `clientSecret` — Your Discord Client Secret
