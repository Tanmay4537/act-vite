# Quick Start

A step-by-step walkthrough of the code `create-actvite` generates. By the end, you'll understand exactly what's happening under the hood.

## The Entry Point

Your `src/main.tsx` wraps the app with `<ActivityProvider>`:

```tsx
import { ActivityProvider } from 'actvite/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <ActivityProvider
    clientId={import.meta.env.VITE_DISCORD_CLIENT_ID}
    fallback={<div>Connecting to Discord...</div>}
    errorFallback={(error) => <div>Error: {error.message}</div>}
  >
    <App />
  </ActivityProvider>
)
```

`ActivityProvider` does everything behind the scenes: initializes the SDK, authenticates, sets up proxying, and tracks participants. Your `<App />` only renders after everything is ready.

## The App Component

Inside `<App>`, you have access to all the hooks:

```tsx
import { useActivity, useParticipants, useCurrentUser } from 'actvite/react'

export function App() {
  const activity = useActivity()    // Full activity instance
  const user = useCurrentUser()     // The authenticated user
  const participants = useParticipants()  // Live participant list

  return (
    <div>
      <h1>Hello, {user.globalName ?? user.username}!</h1>
      <p>Playing in {activity.channel?.name}</p>
      <p>{participants.length} players connected</p>
    </div>
  )
}
```

That's it. No SDK initialization. No OAuth flow. No token exchange logic. Just your UI.

## The Token Exchange Server

The `server/index.ts` is your backend. It has one job: exchange the OAuth code for an access token so your Client Secret never touches the browser.

```ts
import { activityTokenHandler } from 'actvite-server/express'

app.post('/api/token', activityTokenHandler(CLIENT_ID, CLIENT_SECRET))
```

One line. Act-Vite's server adapter handles the Discord API call, error handling, and response formatting.

## What Happens at Runtime

When a user opens your activity in Discord, here's the sequence:

1. `ActivityProvider` creates a `DiscordSDK` instance and waits for `sdk.ready()`
2. Act-Vite calls `sdk.commands.authorize()` to get an OAuth code
3. The code is sent to your server at `POST /api/token`
4. Your server exchanges it for an `access_token` using your Client Secret
5. Act-Vite calls `sdk.commands.authenticate()` with the token
6. Channel info and participant list are fetched
7. Your `<App />` renders with all data ready

All of this happens in about 1-2 seconds. The `fallback` prop shows during the wait.

## Using the Raw SDK

Need something Act-Vite doesn't wrap? The raw Discord SDK is always available:

```tsx
const activity = useActivity()

// Use any raw SDK command
activity.sdk.commands.setActivity({ /* ... */ })
```

No lock-in. No escape hatch needed. The SDK is right there.

---

**What's next?** → [Configuration options](/core/configuration) to customize the behavior.
