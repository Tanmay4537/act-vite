# Configuration

All configuration options for `createActivity()`.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clientId` | `string` | **Required** | Your Discord application's Client ID |
| `scope` | `string[]` | `['identify', 'rpc.activities.write']` | OAuth2 scopes to request |
| `tokenRoute` | `string` | `'/.proxy/api/token'` | URL of your token exchange endpoint |
| `disableConsoleLog` | `boolean` | `false` | Suppress Act-Vite console output |
| `onReady` | `(activity) => void` | — | Called when the activity is initialized |
| `onError` | `(error) => void` | — | Called when initialization fails |

## TypeScript Interface

```ts
interface ActivityConfig {
  clientId: string
  scope?: string[]
  tokenRoute?: string
  disableConsoleLog?: boolean
  onReady?: (activity: ActivityInstance) => void | Promise<void>
  onError?: (error: ActivityError) => void
}
```

## Environment Variables

We recommend using environment variables for your Client ID:

```ts
const activity = await createActivity({
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
})
```

::: warning
Never put your `CLIENT_SECRET` in client-side code. It belongs in the server-side token exchange endpoint only.
:::
