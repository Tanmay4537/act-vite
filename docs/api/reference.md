# API Reference

Complete documentation for every exported function, hook, and type in the Act-Vite monorepo.

---

## Core (`actvite`)

### `createActivity(config)`

The main entry point for Act-Vite. Initializes the Discord SDK, handles auth, patches iframe proxy URLs, and returns a fully ready `ActivityInstance`.

**Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `config.clientId` | `string` | ✅ Yes | — | Your Discord app's Client ID |
| `config.scope` | `string[]` | No | `['identify', 'rpc.activities.write']` | OAuth scopes to request |
| `config.tokenRoute` | `string` | No | `'/.proxy/api/token'` | URL of your token exchange endpoint |
| `config.disableConsoleLog` | `boolean` | No | `false` | Suppress Act-Vite's console output |
| `config.onReady` | `(activity) => void`| No | — | Called when the activity is ready |
| `config.onError` | `(error) => void` | No | — | Called if initialization fails |

**Returns:** `Promise<ActivityInstance>`

**Example**
```ts
import { createActivity } from 'actvite'

const activity = await createActivity({
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
  onReady: (activity) => {
    console.log(`Ready! Hello, ${activity.user.username}`)
  },
})
```

**Throws:** `ActivityError` if initialization fails. See [Error Codes](#error-codes).

### `ActivityInstance`

The object returned when your activity is successfully initialized.

| Property | Type | Description |
|----------|------|-------------|
| `sdk` | `DiscordSDK` | The raw, authenticated Discord SDK instance. Escape hatch for anything Act-Vite doesn't cover natively. |
| `user` | `ActivityUser` | The currently authenticated user running the app. |
| `participants` | `ActivityParticipant[]` | Current array of all users in the specific activity instance. Updates live. |
| `channel` | `ActivityChannel \| null` | The voice channel the activity is running in (null if unknown/DMs). |
| `guild` | `ActivityGuild \| null` | The server (guild) the activity is running in (null if DMs). |
| `isEmbedded` | `boolean` | True if actually running inside Discord, false if in a local browser tab. |
| `config` | `Required<ActivityConfig>` | The fully resolved config used during initialization. |
| `onParticipantsChange` | `(cb) => Unsubscribe` | Register a callback that fires whenever participants join/leave. |

### `ActivityUser`

Represents a Discord user interacting with the activity.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The user's Discord ID |
| `username` | `string` | Their unique Discord username |
| `globalName` | `string \| null` | Their display name (if set) |
| `discriminator` | `string` | Legacy discriminator (usually "0" for migrated names) |
| `avatar` | `string \| null` | Avatar image hash |
| `avatarUrl` | `string` | Fully resolved URL to their avatar image |
| `bot` | `boolean` | True if the user is a bot |
| `premiumType` | `0 \| 1 \| 2 \| 3` | Nitro status (0=None, 1=Classic, 2=Full, 3=Basic) |

### `ActivityParticipant`

A user who is currently connected to the specific activity instance.

| Property | Type | Description |
|----------|------|-------------|
| `user` | `ActivityUser` | The participant's user information |
| `avatarUrl` | `string` | Resolved avatar URL |

### `isEmbedded()`

A utility function that synchronous checks if the code is running inside Discord's iframe environment. Useful for conditional rendering early in the app lifecycle.

**Returns:** `boolean`

---

## React Bindings (`actvite/react`)

### `<ActivityProvider>`

A context provider designed to wrap your root React component. It handles the async `createActivity()` call securely and manages the loading/error states.

**Props**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `clientId` | `string` | ✅ Yes | Your Discord app's Client ID |
| `fallback` | `ReactNode` | No | UI to show while connecting to Discord |
| `errorFallback` | `(err) => ReactNode`| No | UI to show if connection fails |
| `scope` | `string[]` | No | Custom OAuth scopes |
| `tokenRoute` | `string` | No | Custom token exchange route |

### `useActivity()`

**Returns:** `ActivityInstance`
Throws an error if used outside an `<ActivityProvider>`.

### `useCurrentUser()`

**Returns:** `ActivityUser`
A convenience hook that returns `activity.user`.

### `useParticipants()`

**Returns:** `ActivityParticipant[]`
A reactive hook that triggers a re-render whenever someone joins or leaves the activity.

---

## Vue Bindings (`actvite/vue`)

### `useActivity(config)`

Initializes the activity and returns a Vue `shallowRef` that populates when ready.

**Parameters:** `ActivityConfig` (The same config as `createActivity`)
**Returns:** `{ activity: ShallowRef<ActivityInstance | null>, error: ShallowRef<ActivityError | null> }`

### `useParticipants(activityRef)`

Returns a reactive ref of the participants list that updates live.

**Returns:** `Ref<ActivityParticipant[]>`

---

## Svelte Bindings (`actvite/svelte`)

### `createActivityStore(config)`

Returns a Svelte readable store that resolves with the activity.

**Parameters:** `ActivityConfig`
**Returns:** `Readable<{ loading: boolean, activity: ActivityInstance | null, error: ActivityError | null }>`

### `createParticipantsStore(activity)`

**Returns:** `Readable<ActivityParticipant[]>`

---

## Server (`actvite-server`)

### `activityTokenHandler(clientId, clientSecret)`

The single middleware/handler you need on your backend. Available for 3 frameworks:
- `import { activityTokenHandler } from 'actvite-server/express'`
- `import { activityTokenHandler } from 'actvite-server/hono'`

**Returns:** The appropriate middleware for your selected framework.

### `activityTokenPlugin`

For Fastify:
`import { activityTokenPlugin } from 'actvite-server/fastify'`

Register it to your Fastify instance with `clientId` and `clientSecret` options.

---

## Multiplayer (`actvite-multiplayer`)

### `createSharedState(url)`

Initializes a WebSocket connection to the multiplayer server and creates a shared state manager.

**Parameters:** `url` (string) — The WebSocket URL (e.g., `ws://localhost:3001/ws`)
**Returns:** `SharedState`

### `SharedState`

| Method | Description |
|--------|-------------|
| `.set(key, value)` | Updates a generic state value and broadcasts it to everyone. |
| `.get(key)` | Synchronously reads the local cache of a value. |
| `.on(key, callback)` | Listens for updates to a specific key. |
| `.disconnect()` | Closes the WebSocket connection. |

---

## Error Codes

When things go wrong, Act-Vite throws an `ActivityError`. You can read its `.code` property programmatically.

| Code | When it occurs | How to fix it |
|------|---------------|---------------|
| `MISSING_CLIENT_ID` | `clientId` not provided in config | Add your Discord app's Client ID |
| `AUTH_FAILED` | Discord OAuth rejected | Check clientId, URL mappings in Developer Portal |
| `TOKEN_EXCHANGE_FAILED` | Server returned non-200 | Check your server is running, check `DISCORD_CLIENT_SECRET` |
| `SDK_NOT_READY` | SDK used before init | Always await `createActivity()` before using SDK |
| `INVALID_CONFIG` | Malformed config object | Check the config options table above |
| `NETWORK_ERROR` | Fetch failed during init | Check your dev tunnel is working |

> *If you see an error not listed here, congratulations — you've found a bug. Please open an issue. We don't bite.*
