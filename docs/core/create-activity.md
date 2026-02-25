# createActivity()

The main entry point for Act-Vite. Initializes the Discord SDK, authenticates, and returns a fully-configured activity instance.

## Usage

```ts
import { createActivity } from 'actvite'

const activity = await createActivity({
  clientId: 'YOUR_DISCORD_CLIENT_ID',
})
```

## What It Does

1. **Initializes** the Discord Embedded App SDK
2. **Patches** URL mappings for iframe proxy routing
3. **Authenticates** via OAuth2 (authorize → token exchange → authenticate)
4. **Fetches** channel and guild information
5. **Sets up** participant tracking with live updates

## Options

See [Configuration](/core/configuration) for all available options.

## Return Value

Returns a `Promise<ActivityInstance>` with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `sdk` | `DiscordSDK` | The raw Discord SDK instance |
| `user` | `ActivityUser` | The authenticated user |
| `channel` | `ActivityChannel \| null` | Current channel info |
| `guild` | `ActivityGuild \| null` | Current guild info |
| `participants` | `ActivityParticipant[]` | Live participant list |
| `onParticipantsChange` | `Function` | Subscribe to participant changes |
| `isEmbedded` | `boolean` | Whether running inside Discord |
| `config` | `Required<ActivityConfig>` | Resolved configuration |

## Example with Options

```ts
const activity = await createActivity({
  clientId: '1234567890',
  scope: ['identify', 'rpc.activities.write'],
  tokenRoute: '/.proxy/api/token',
  disableConsoleLog: false,
  onReady: (act) => {
    console.log(`Ready! User: ${act.user.username}`)
  },
  onError: (err) => {
    console.error('Failed to initialize:', err)
  },
})
```

## Escape Hatch

The raw Discord SDK is always available:

```ts
const activity = await createActivity({ clientId: '...' })

// Use the raw SDK directly
activity.sdk.commands.setActivity({ ... })
```
