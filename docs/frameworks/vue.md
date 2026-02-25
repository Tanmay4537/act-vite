# Vue

Act-Vite provides Vue 3 composables via `actvite/vue`.

## Installation

```bash
pnpm add actvite vue
```

## Composables

### `useActivity(config)`

Initializes the activity and returns reactive refs.

```vue
<script setup lang="ts">
import { useActivity } from 'actvite/vue'

const { activity, isLoading, error } = useActivity({
  clientId: 'YOUR_CLIENT_ID',
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>Hello, {{ activity?.user.username }}!</div>
</template>
```

### `useParticipants(activity)`

Returns a reactive participant list.

```vue
<script setup lang="ts">
import { useActivity, useParticipants } from 'actvite/vue'

const { activity } = useActivity({ clientId: 'YOUR_CLIENT_ID' })
const participants = useParticipants(activity)
</script>

<template>
  <ul>
    <li v-for="p in participants" :key="p.user.id">
      <img :src="p.avatarUrl" :alt="p.user.username" />
      {{ p.user.username }}
    </li>
  </ul>
</template>
```
