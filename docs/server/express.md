# Express

## Setup

```ts
import express from 'express'
import { activityTokenHandler } from 'actvite-server/express'

const app = express()
app.use(express.json())

app.post('/api/token', activityTokenHandler(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
))

app.listen(3001)
```

## `activityTokenHandler(clientId, clientSecret)`

Creates an Express middleware that handles the token exchange.

**Parameters:**
- `clientId` — Your Discord Client ID
- `clientSecret` — Your Discord Client Secret

**Request Body:**
```json
{ "code": "authorization_code_here" }
```

**Response:**
```json
{ "access_token": "access_token_here" }
```
