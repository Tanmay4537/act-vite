# actvite

> The Discord Activity framework. Build embedded apps with confidence.

Act-Vite handles OAuth2 authentication, iframe proxying, and participant tracking so you can focus on building your Discord Activity experience.

## Installation

```bash
npm install actvite
# or
pnpm add actvite
```

## Quick Start

```ts
import { createActivity } from 'actvite'

const activity = await createActivity({
  clientId: 'YOUR_DISCORD_CLIENT_ID',
})

console.log(`Hello, ${activity.user.username}!`)
console.log(`Channel: ${activity.channel?.name}`)
console.log(`Participants: ${activity.participants.length}`)
```

### React

```tsx
import { ActivityProvider, useActivity, useParticipants } from 'actvite/react'

function App() {
  return (
    <ActivityProvider clientId="YOUR_CLIENT_ID" fallback={<div>Loading...</div>}>
      <Game />
    </ActivityProvider>
  )
}

function Game() {
  const activity = useActivity()
  const participants = useParticipants()

  return (
    <div>
      <h1>Hello, {activity.user.username}!</h1>
      <p>{participants.length} players in the activity</p>
    </div>
  )
}
```

### Vue

```vue
<script setup lang="ts">
import { useActivity, useParticipants } from 'actvite/vue'

const { activity, isLoading, error } = useActivity({ clientId: 'YOUR_CLIENT_ID' })
const participants = useParticipants(activity)
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>
    <h1>Hello, {{ activity?.user.username }}!</h1>
    <p>{{ participants.length }} players</p>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { createActivityStore } from 'actvite/svelte'

  const store = createActivityStore({ clientId: 'YOUR_CLIENT_ID' })
</script>

{#if $store.isLoading}
  <p>Loading...</p>
{:else if $store.error}
  <p>{$store.error.message}</p>
{:else}
  <h1>Hello, {$store.activity?.user.username}!</h1>
{/if}
```

## Documentation

Full documentation is available at [actvite.dev](https://actvite.dev).

## License

MIT © Act-Vite Contributors
