// packages/create-actvite/src/scaffold.ts

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Scaffold options from the CLI prompts.
 * @internal
 */
export interface ScaffoldOptions {
    projectName: string
    framework: string
    serverFramework: string
    extras: string[]
    targetDir: string
}

/**
 * Scaffolds a new Act-Vite project.
 * @param options - The scaffold configuration from CLI prompts
 * @internal
 */
export async function scaffold(options: ScaffoldOptions): Promise<void> {
    const { targetDir, projectName, framework, serverFramework, extras } = options
    const dir = (path: string) => join(targetDir, path)

    // Create directories
    mkdirSync(dir('src'), { recursive: true })
    mkdirSync(dir('server'), { recursive: true })
    mkdirSync(dir('public'), { recursive: true })

    // Root package.json
    const deps: Record<string, string> = {
        actvite: '^0.1.0',
    }
    const devDeps: Record<string, string> = {
        vite: '^5.1.0',
        typescript: '^5.4.0',
    }
    const serverDeps: Record<string, string> = {
        'actvite-server': '^0.1.0',
        dotenv: '^16.4.0',
    }

    // Framework-specific deps
    if (framework.startsWith('react')) {
        deps['react'] = '^18.2.0'
        deps['react-dom'] = '^18.2.0'
        devDeps['@types/react'] = '^18.2.0'
        devDeps['@types/react-dom'] = '^18.2.0'
        devDeps['@vitejs/plugin-react'] = '^4.2.0'
    } else if (framework.startsWith('vue')) {
        deps['vue'] = '^3.4.0'
        devDeps['@vitejs/plugin-vue'] = '^5.0.0'
    } else if (framework.startsWith('svelte')) {
        deps['svelte'] = '^4.2.0'
        devDeps['@sveltejs/vite-plugin-svelte'] = '^3.0.0'
    }

    // Server framework deps
    if (serverFramework === 'express') {
        serverDeps['express'] = '^4.18.0'
        serverDeps['cors'] = '^2.8.5'
    } else if (serverFramework === 'hono') {
        serverDeps['hono'] = '^4.0.0'
        serverDeps['@hono/node-server'] = '^1.8.0'
    } else if (serverFramework === 'fastify') {
        serverDeps['fastify'] = '^4.26.0'
        serverDeps['@fastify/cors'] = '^9.0.0'
    }

    // Multiplayer
    if (extras.includes('multiplayer')) {
        deps['actvite-multiplayer'] = '^0.1.0'
    }

    // ESLint/Prettier
    if (extras.includes('eslint')) {
        devDeps['eslint'] = '^8.57.0'
        devDeps['prettier'] = '^3.2.5'
        devDeps['@typescript-eslint/eslint-plugin'] = '^7.0.0'
        devDeps['@typescript-eslint/parser'] = '^7.0.0'
    }

    const pkgJson = {
        name: projectName,
        version: '0.0.1',
        private: true,
        type: 'module',
        scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
            'server:dev': `node --watch server/index.${framework.endsWith('-ts') ? 'ts' : 'js'}`,
        },
        dependencies: deps,
        devDependencies: devDeps,
    }

    writeFileSync(dir('package.json'), JSON.stringify(pkgJson, null, 2) + '\n')

    // Server package.json
    const serverPkgJson = {
        name: `${projectName}-server`,
        version: '0.0.1',
        private: true,
        type: 'module',
        dependencies: serverDeps,
    }
    writeFileSync(dir('server/package.json'), JSON.stringify(serverPkgJson, null, 2) + '\n')

    // .env.example
    writeFileSync(
        dir('.env'),
        `DISCORD_CLIENT_ID=your_client_id_here\nDISCORD_CLIENT_SECRET=your_client_secret_here\n`,
    )

    // .gitignore
    writeFileSync(dir('.gitignore'), 'node_modules/\ndist/\n.env\n.env.local\n')

    // tsconfig.json
    writeFileSync(
        dir('tsconfig.json'),
        JSON.stringify(
            {
                compilerOptions: {
                    target: 'ES2022',
                    module: 'ESNext',
                    moduleResolution: 'Bundler',
                    strict: true,
                    jsx: framework.startsWith('react') ? 'react-jsx' : undefined,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
                },
                include: ['src'],
            },
            null,
            2,
        ) + '\n',
    )

    // Vite config
    writeFileSync(dir('vite.config.ts'), generateViteConfig(framework))

    // index.html
    writeFileSync(dir('index.html'), generateIndexHtml(projectName, framework))

    // Source files
    generateSourceFiles(dir, framework, extras)

    // Server files
    generateServerFiles(dir, serverFramework)

    // README
    writeFileSync(dir('README.md'), generateReadme(projectName, framework, serverFramework))
}

function generateViteConfig(framework: string): string {
    if (framework.startsWith('react')) {
        return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
`
    }

    if (framework.startsWith('vue')) {
        return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
`
    }

    if (framework.startsWith('svelte')) {
        return `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
`
    }

    return `import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
`
}

function generateIndexHtml(projectName: string, framework: string): string {
    const scriptSrc = framework.startsWith('react')
        ? '/src/main.tsx'
        : framework.startsWith('vue')
            ? '/src/main.ts'
            : framework.startsWith('svelte')
                ? '/src/main.ts'
                : '/src/main.ts'

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} — Discord Activity</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${scriptSrc}"></script>
  </body>
</html>
`
}

function generateSourceFiles(dir: (p: string) => string, framework: string, extras: string[]): void {
    // CSS
    writeFileSync(
        dir('src/style.css'),
        `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #1a1a2e;
  color: #eee;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.activity-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #5865f2;
}

.username {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.participant-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
}

.participant {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(88, 101, 242, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
}

.participant img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.loading {
  font-size: 1.2rem;
  color: #888;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #5865f2, #eb459e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`,
    )

    if (framework.startsWith('react')) {
        // React main
        writeFileSync(
            dir('src/main.tsx'),
            `import React from 'react'
import ReactDOM from 'react-dom/client'
import { ActivityProvider } from 'actvite/react'
import { App } from './App'
import './style.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ActivityProvider
      clientId={import.meta.env.VITE_DISCORD_CLIENT_ID ?? ''}
      fallback={<div className="loading">Connecting to Discord...</div>}
      errorFallback={(error) => <div className="loading">Error: {error.message}</div>}
    >
      <App />
    </ActivityProvider>
  </React.StrictMode>,
)
`,
        )

        writeFileSync(
            dir('src/App.tsx'),
            `import { useActivity, useParticipants, useCurrentUser } from 'actvite/react'

export function App() {
  const activity = useActivity()
  const user = useCurrentUser()
  const participants = useParticipants()

  return (
    <div>
      <h1>🎮 My Activity</h1>

      <div className="activity-card">
        <img className="avatar" src={user.avatarUrl} alt={user.username} />
        <div className="username">{user.globalName ?? user.username}</div>
        <p>Playing in {activity.channel?.name ?? 'a channel'}</p>
      </div>

      <div className="activity-card">
        <h2>Players ({participants.length})</h2>
        <ul className="participant-list">
          {participants.map((p) => (
            <li key={p.user.id} className="participant">
              <img src={p.avatarUrl} alt={p.user.username} />
              <span>{p.user.globalName ?? p.user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
`,
        )

        // Vite env types
        writeFileSync(
            dir('src/vite-env.d.ts'),
            `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`,
        )
    } else if (framework.startsWith('vue')) {
        writeFileSync(
            dir('src/main.ts'),
            `import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
`,
        )

        writeFileSync(
            dir('src/App.vue'),
            `<script setup lang="ts">
import { useActivity, useParticipants } from 'actvite/vue'

const { activity, isLoading, error } = useActivity({
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID ?? '',
})

const participants = useParticipants(activity)
</script>

<template>
  <div v-if="isLoading" class="loading">Connecting to Discord...</div>
  <div v-else-if="error" class="loading">Error: {{ error.message }}</div>
  <div v-else>
    <h1>🎮 My Activity</h1>

    <div class="activity-card">
      <img class="avatar" :src="activity?.user.avatarUrl" :alt="activity?.user.username" />
      <div class="username">{{ activity?.user.globalName ?? activity?.user.username }}</div>
      <p>Playing in {{ activity?.channel?.name ?? 'a channel' }}</p>
    </div>

    <div class="activity-card">
      <h2>Players ({{ participants.length }})</h2>
      <ul class="participant-list">
        <li v-for="p in participants" :key="p.user.id" class="participant">
          <img :src="p.avatarUrl" :alt="p.user.username" />
          <span>{{ p.user.globalName ?? p.user.username }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
`,
        )

        writeFileSync(
            dir('src/vite-env.d.ts'),
            `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`,
        )
    } else if (framework.startsWith('svelte')) {
        writeFileSync(
            dir('src/main.ts'),
            `import App from './App.svelte'
import './style.css'

const app = new App({ target: document.getElementById('app')! })

export default app
`,
        )

        writeFileSync(
            dir('src/App.svelte'),
            `<script lang="ts">
  import { createActivityStore, createParticipantsStore } from 'actvite/svelte'

  const store = createActivityStore({
    clientId: import.meta.env.VITE_DISCORD_CLIENT_ID ?? '',
  })
</script>

{#if $store.isLoading}
  <div class="loading">Connecting to Discord...</div>
{:else if $store.error}
  <div class="loading">Error: {$store.error.message}</div>
{:else}
  <h1>🎮 My Activity</h1>

  <div class="activity-card">
    <img class="avatar" src={$store.activity?.user.avatarUrl} alt={$store.activity?.user.username} />
    <div class="username">{$store.activity?.user.globalName ?? $store.activity?.user.username}</div>
    <p>Playing in {$store.activity?.channel?.name ?? 'a channel'}</p>
  </div>
{/if}
`,
        )

        writeFileSync(
            dir('src/vite-env.d.ts'),
            `/// <reference types="vite/client" />
/// <reference types="svelte" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`,
        )
    } else {
        // Vanilla TS
        writeFileSync(
            dir('src/main.ts'),
            `import { createActivity } from 'actvite'
import './style.css'

async function main() {
  const app = document.getElementById('app')!
  app.innerHTML = '<div class="loading">Connecting to Discord...</div>'

  try {
    const activity = await createActivity({
      clientId: import.meta.env.VITE_DISCORD_CLIENT_ID ?? '',
    })

    app.innerHTML = \`
      <h1>🎮 My Activity</h1>

      <div class="activity-card">
        <img class="avatar" src="\${activity.user.avatarUrl}" alt="\${activity.user.username}" />
        <div class="username">\${activity.user.globalName ?? activity.user.username}</div>
        <p>Playing in \${activity.channel?.name ?? 'a channel'}</p>
      </div>

      <div class="activity-card">
        <h2>Players (\${activity.participants.length})</h2>
        <ul class="participant-list" id="participants"></ul>
      </div>
    \`

    const renderParticipants = (participants: typeof activity.participants) => {
      const list = document.getElementById('participants')!
      list.innerHTML = participants.map(p => \`
        <li class="participant">
          <img src="\${p.avatarUrl}" alt="\${p.user.username}" />
          <span>\${p.user.globalName ?? p.user.username}</span>
        </li>
      \`).join('')
    }

    renderParticipants(activity.participants)
    activity.onParticipantsChange(renderParticipants)
  } catch (error) {
    app.innerHTML = \`<div class="loading">Error: \${error instanceof Error ? error.message : String(error)}</div>\`
  }
}

main()
`,
        )

        writeFileSync(
            dir('src/vite-env.d.ts'),
            `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`,
        )
    }
}

function generateServerFiles(dir: (p: string) => string, serverFramework: string): void {
    if (serverFramework === 'express') {
        writeFileSync(
            dir('server/index.ts'),
            `import 'dotenv/config'
import express from 'express'
import { activityTokenHandler } from 'actvite-server/express'

const app = express()
app.use(express.json())

const clientId = process.env.DISCORD_CLIENT_ID
const clientSecret = process.env.DISCORD_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error('[server] Missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET in .env')
  process.exit(1)
}

app.post('/api/token', activityTokenHandler(clientId, clientSecret))

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(\`[server] Token exchange server running on http://localhost:\${PORT}\`)
})
`,
        )
    } else if (serverFramework === 'hono') {
        writeFileSync(
            dir('server/index.ts'),
            `import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { activityTokenHandler } from 'actvite-server/hono'

const app = new Hono()

const clientId = process.env.DISCORD_CLIENT_ID
const clientSecret = process.env.DISCORD_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error('[server] Missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET in .env')
  process.exit(1)
}

app.post('/api/token', activityTokenHandler(clientId, clientSecret))

const PORT = Number(process.env.PORT ?? 3001)
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(\`[server] Token exchange server running on http://localhost:\${PORT}\`)
})
`,
        )
    } else if (serverFramework === 'fastify') {
        writeFileSync(
            dir('server/index.ts'),
            `import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { activityTokenPlugin } from 'actvite-server/fastify'

const clientId = process.env.DISCORD_CLIENT_ID
const clientSecret = process.env.DISCORD_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error('[server] Missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET in .env')
  process.exit(1)
}

const fastify = Fastify({ logger: true })

await fastify.register(cors)
await fastify.register(activityTokenPlugin(clientId, clientSecret))

const PORT = Number(process.env.PORT ?? 3001)
fastify.listen({ port: PORT }, () => {
  console.log(\`[server] Token exchange server running on http://localhost:\${PORT}\`)
})
`,
        )
    }
}

function generateReadme(projectName: string, framework: string, serverFramework: string): string {
    return `# ${projectName}

A Discord Activity built with [Act-Vite](https://actvite.dev).

## Setup

1. Install dependencies:

\`\`\`bash
pnpm install
cd server && pnpm install && cd ..
\`\`\`

2. Add your Discord credentials to \`.env\`:

\`\`\`
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
\`\`\`

3. Start the dev server:

\`\`\`bash
# Terminal 1 — Start the frontend
pnpm dev

# Terminal 2 — Start the token exchange server
cd server && npx tsx index.ts
\`\`\`

4. Configure URL mappings in the Discord Developer Portal.

## Stack

- Frontend: ${framework.replace('-ts', ' + TypeScript').replace('-js', ' + JavaScript')}
- Server: ${serverFramework.charAt(0).toUpperCase() + serverFramework.slice(1)}
- Framework: [Act-Vite](https://actvite.dev)

## Documentation

See the [Act-Vite docs](https://actvite.dev) for full documentation.
`
}
