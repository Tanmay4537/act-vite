<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { ref, onMounted } from 'vue'

const showBanner = ref(false)

onMounted(() => {
  const dismissed = localStorage.getItem('actvite-banner-dismissed')
  if (!dismissed) {
    showBanner.value = true
  }
})

function dismissBanner() {
  showBanner.value = false
  localStorage.setItem('actvite-banner-dismissed', '1')
}
</script>

<template>
  <div v-if="showBanner" class="star-banner">
    ⭐ If Act-Vite saved you hours of boilerplate, consider starring the repo. It means the world to us.
    <a href="https://github.com/actvite/actvite" target="_blank" rel="noopener">Star on GitHub →</a>
    <button class="close-btn" @click="dismissBanner" aria-label="Dismiss banner">✕</button>
  </div>
  <DefaultTheme.Layout />
</template>
