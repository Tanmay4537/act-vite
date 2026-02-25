# Svelte

Act-Vite provides Svelte-compatible stores via `actvite/svelte`.

## Installation

```bash
pnpm add actvite svelte
```

## Stores

### `createActivityStore(config)`

Creates a readable store for the activity.

```svelte
<script>
  import { createActivityStore } from 'actvite/svelte'

  const store = createActivityStore({ clientId: 'YOUR_CLIENT_ID' })
</script>

{#if $store.isLoading}
  <p>Loading...</p>
{:else if $store.error}
  <p>Error: {$store.error.message}</p>
{:else}
  <p>Hello, {$store.activity?.user.username}!</p>
{/if}
```

### `createParticipantsStore(activity)`

Creates a readable store for the participant list.

```svelte
<script>
  import { createActivityStore, createParticipantsStore } from 'actvite/svelte'

  const store = createActivityStore({ clientId: 'YOUR_CLIENT_ID' })

  // Create participants store after activity is loaded
  $: participantsStore = $store.activity
    ? createParticipantsStore($store.activity)
    : null
</script>

{#if participantsStore}
  {#each $participantsStore as p}
    <div>{p.user.username}</div>
  {/each}
{/if}
```
