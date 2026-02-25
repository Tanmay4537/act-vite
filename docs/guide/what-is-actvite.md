# What is Act-Vite?

Act-Vite is a developer framework for building [Discord Activities](https://discord.com/developers/docs/activities/overview) — interactive apps that run inside Discord voice channels and DMs.

It wraps Discord's Embedded App SDK and handles the ceremony so you can focus on building the actual experience.

## What Discord Activities Are

Imagine you're in a Discord voice channel with friends. Someone says "let's play a quiz game." Instead of alt-tabbing to a browser, everyone just clicks a button inside Discord and BAM — a full interactive app appears right in the voice channel.

That's a Discord Activity. It's a web app running inside an iframe in the Discord client. It can see who's in the voice channel, who joins and leaves, and even share real-time state between everyone.

Pretty cool, right? Building one, however...

## What Act-Vite Does

Act-Vite sits between your app code and the raw Discord SDK:

```
Your App Code         ← You write this. The fun part.
     ↓
  Act-Vite            ← This handles the boring parts.
     ↓
Discord Embedded App SDK
     ↓
Discord iframe / RPC
     ↓
Discord Client        ← Your users see this.
```

Specifically, Act-Vite handles:
- **Initializing** the Discord SDK and waiting for it to be ready
- **OAuth2 authentication** — authorize, exchange code for token, authenticate
- **Iframe proxy patching** — so your API calls work inside Discord's sandbox
- **Participant tracking** — who's here, who just joined, who left
- **Error handling** — human-readable errors that point to the docs

All in a single function call: `createActivity()`.

## What Act-Vite is NOT

Let's be honest about what this framework doesn't do:

- **Not a game engine.** Use Phaser, PixiJS, Three.js, or whatever you like for that. Act-Vite just gets you authenticated and tracking participants — the game logic is yours.
- **Not a full multiplayer backend.** The `actvite-multiplayer` package is a lightweight helper for shared state over WebSockets. For complex multiplayer with authoritative servers, use Colyseus, Socket.io, or a custom solution.
- **Not a replacement for the Discord SDK.** It's a layer on top of it. The raw SDK is always available via `activity.sdk`. If Act-Vite doesn't support something, drop down to the raw SDK. No lock-in.

## Packages

| Package | What it does |
|---------|-------------|
| `actvite` | Core — auth, proxy, participants |
| `actvite/react` | React hooks and `<ActivityProvider>` |
| `actvite/vue` | Vue composables |
| `actvite/svelte` | Svelte stores |
| `actvite-server` | Server-side token exchange (Express, Hono, Fastify) |
| `actvite-multiplayer` | Shared state and room management |
| `create-actvite` | CLI — scaffold a new project in seconds |

---

*Act-Vite won't make you a 10x developer. But it might give you back the 2 hours you'd spend copy-pasting OAuth boilerplate, and that's worth something.*

**What's next?** → [Getting Started](/guide/getting-started)
