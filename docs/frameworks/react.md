# React

Act-Vite provides first-class React support via `actvite/react`.

## Installation

```bash
pnpm add actvite react react-dom
```

## ActivityProvider

Wrap your application with `<ActivityProvider>`:

```tsx
import { ActivityProvider } from 'actvite/react'

function Root() {
  return (
    <ActivityProvider
      clientId="YOUR_CLIENT_ID"
      fallback={<div>Loading...</div>}
      errorFallback={(error) => <div>Error: {error.message}</div>}
    >
      <App />
    </ActivityProvider>
  )
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `clientId` | `string` | Your Discord Client ID |
| `config` | `Omit<ActivityConfig, 'clientId'>` | Additional config options |
| `fallback` | `ReactNode` | Shown while loading |
| `errorFallback` | `(error: Error) => ReactNode` | Shown on error |
| `children` | `ReactNode` | Your app |

## Hooks

### `useActivity()`

Returns the full `ActivityInstance`.

```tsx
const activity = useActivity()
console.log(activity.user.username)
console.log(activity.channel?.name)
```

### `useCurrentUser()`

Returns the authenticated `ActivityUser`.

```tsx
const user = useCurrentUser()
return <img src={user.avatarUrl} alt={user.username} />
```

### `useParticipants()`

Returns the live participant list. Re-renders on changes.

```tsx
const participants = useParticipants()
return (
  <ul>
    {participants.map(p => (
      <li key={p.user.id}>{p.user.username}</li>
    ))}
  </ul>
)
```

### `useIsEmbedded()`

Returns `true` if running inside the Discord iframe.

```tsx
const isEmbedded = useIsEmbedded()
if (!isEmbedded) return <DevTools />
```

### `useChannel()`

Returns the current `ActivityChannel` or `null`.

### `useGuild()`

Returns the current `ActivityGuild` or `null`.
