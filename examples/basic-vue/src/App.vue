<script setup lang="ts">
import { useActivity, useParticipants } from 'actvite/vue'

const { activity, isLoading, error } = useActivity({
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID ?? '',
})

const participants = useParticipants(activity)
</script>

<template>
  <div style="font-family: sans-serif; background: #1a1a2e; color: #eee; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="max-width: 500px; width: 100%; padding: 1.5rem; text-align: center;">
      <div v-if="isLoading" style="color: #888;">Loading...</div>
      <div v-else-if="error" style="color: #eb459e;">{{ error.message }}</div>
      <div v-else>
        <h1 style="background: linear-gradient(135deg, #5865f2, #eb459e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          🎮 Vue Activity
        </h1>
        <div style="background: rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; margin: 1rem 0;">
          <img :src="activity?.user.avatarUrl" :alt="activity?.user.username" style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid #5865f2;" />
          <h2>{{ activity?.user.globalName ?? activity?.user.username }}</h2>
          <p style="color: #aaa;">Playing in {{ activity?.channel?.name ?? 'a channel' }}</p>
        </div>
        <div style="background: rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem;">
          <h3>Players ({{ participants.length }})</h3>
          <div v-for="p in participants" :key="p.user.id" style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(88,101,242,0.2); padding: 0.4rem 0.8rem; border-radius: 999px; margin: 0.25rem; font-size: 0.85rem;">
            <img :src="p.avatarUrl" :alt="p.user.username" style="width: 24px; height: 24px; border-radius: 50%;" />
            <span>{{ p.user.globalName ?? p.user.username }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
