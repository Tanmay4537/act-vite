# Changelog

All notable changes to the Act-Vite packages will be documented in this file.

## [0.1.0] — Initial Release

### 🎉 Initial Features

#### `actvite` — Core Runtime
- `createActivity()` — Initialize Discord Activities with one function call
- Full OAuth2 authentication flow (authorize → token exchange → authenticate)
- Automatic iframe proxy URL patching
- Live participant tracking with `onParticipantsChange()`
- Channel and guild info fetching
- `isEmbedded()` utility for environment detection
- Typed `ActivityError` with machine-readable error codes and docs links

#### `actvite/react` — React Bindings
- `<ActivityProvider>` with fallback and error boundary support
- `useActivity()` — Access the full activity instance
- `useCurrentUser()` — Get the authenticated user
- `useParticipants()` — Live participant list with auto-rerender
- `useIsEmbedded()`, `useChannel()`, `useGuild()` — Utility hooks

#### `actvite/vue` — Vue Composables
- `useActivity(config)` — Reactive activity initialization
- `useParticipants(activity)` — Reactive participant list

#### `actvite/svelte` — Svelte Stores
- `createActivityStore(config)` — Readable activity store
- `createParticipantsStore(activity)` — Readable participant store

#### `actvite-server` — Server Helpers
- `exchangeToken()` — Core Discord OAuth2 token exchange
- `activityTokenHandler()` — Express middleware
- `activityTokenHandler()` — Hono route handler
- `activityTokenPlugin()` — Fastify plugin

#### `actvite-multiplayer` — Multiplayer
- `createSharedState()` — Reactive shared state with WebSocket sync
- `RoomManager` — Server-side room management
- `createMultiplayerServer()` — WebSocket server helper

#### `create-actvite` — CLI
- Interactive project scaffolding
- Templates: React (TS/JS), Vue, Svelte, Vanilla TS
- Server framework selection: Express, Hono, Fastify
- Optional multiplayer and ESLint/Prettier support
