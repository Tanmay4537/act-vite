# Authentication

Act-Vite handles the full OAuth2 authentication flow automatically.

## How It Works

```
1. SDK Ready       → Discord SDK initializes
2. Authorize       → User grants OAuth2 permissions
3. Token Exchange  → Code is sent to YOUR server for token exchange
4. Authenticate    → SDK is authenticated with the access token
```

## Token Exchange Server

The **only server-side requirement** is a token exchange endpoint. Act-Vite sends the authorization `code` to this endpoint, and expects an `access_token` back:

**Request:**
```json
POST /api/token
{ "code": "abc123..." }
```

**Response:**
```json
{ "access_token": "xyz789..." }
```

Use `actvite-server` to set this up in one line:

```ts
import { activityTokenHandler } from 'actvite-server/express'

app.post('/api/token', activityTokenHandler(CLIENT_ID, CLIENT_SECRET))
```

## Custom Token Route

By default, Act-Vite sends the code to `/.proxy/api/token`. You can customize this:

```ts
const activity = await createActivity({
  clientId: '...',
  tokenRoute: '/my-custom-api/exchange',
})
```

## Custom Scopes

```ts
const activity = await createActivity({
  clientId: '...',
  scope: ['identify', 'rpc.activities.write', 'guilds'],
})
```
