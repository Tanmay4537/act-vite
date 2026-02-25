# Hono

## Setup

```ts
import { Hono } from 'hono'
import { activityTokenHandler } from 'actvite-server/hono'

const app = new Hono()

app.post('/api/token', activityTokenHandler(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
))

export default app
```

## `activityTokenHandler(clientId, clientSecret)`

Creates a Hono route handler for the token exchange.

**Parameters:**
- `clientId` — Your Discord Client ID
- `clientSecret` — Your Discord Client Secret
