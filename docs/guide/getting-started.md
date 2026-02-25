# Getting Started

Go from zero to a running, authenticated Discord Activity. This page walks you through every step.

## Prerequisites

::: info Before you begin
- **Node.js 18+** — [Download here](https://nodejs.org)
- **pnpm** — Install with `npm install -g pnpm`
- **A Discord account** — You probably have one if you're reading this
- **A Discord application** — [Create one here](https://discord.com/developers/applications)
:::

## 1. Create Your Activity

The fastest way to start is with the CLI:

```bash
npx create-actvite my-activity
```

You'll get a few quick prompts:
1. **Frontend framework** — React, Vue, Svelte, or Vanilla TypeScript
2. **Server framework** — Express (most familiar), Hono (lightweight), or Fastify (fast)
3. **Extras** — Multiplayer support, ESLint

It generates a complete, runnable project. No empty files. No placeholder comments. Real code that works.

## 2. Set Up Your Discord App

Head to the [Discord Developer Portal](https://discord.com/developers/applications) and either create a new application or select an existing one.

You need three things from here:

**Your Client ID**
- Go to **General Information**
- Copy the **Application ID** (this is your Client ID)

**Your Client Secret**
- Go to **OAuth2 → General**
- Copy the **Client Secret** (click "Reset Secret" if you haven't set one)

**Enable Activities**
- Go to **Activities → Getting Started**
- Add a URL mapping:
  - Prefix: `/`
  - Target: `http://localhost:5173`
- Add another URL mapping:
  - Prefix: `/.proxy/api`
  - Target: `http://localhost:3001/api`

::: details 💡 The Developer Portal is... a lot
We know. It's a big portal with a lot of options. For Act-Vite, you only need three things: your Client ID, your Client Secret, and the Activities section. Ignore everything else for now. You can explore the rest later when you're feeling adventurous.
:::

## 3. Configure Your Environment

Add your Discord credentials to the `.env` file in your project root:

```env
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
```

And create a `.env` with the client ID for Vite:

```env
VITE_DISCORD_CLIENT_ID=your_client_id_here
```

::: warning
Never commit your `.env` file. Never put your Client Secret in client-side code. It belongs on the server only. Your `.gitignore` already handles this.
:::

## 4. Install & Run

```bash
cd my-activity
pnpm install

# Also install server dependencies
cd server && pnpm install && cd ..
```

Now start both servers:

```bash
# Terminal 1 — Frontend
pnpm dev

# Terminal 2 — Token exchange server
cd server && npx tsx index.ts
```

Your Vite dev server starts at `http://localhost:5173` and your token exchange server at `http://localhost:3001`.

::: details 💡 Wait, I need to run two servers in development?
Yes. A Vite dev server for your frontend and a Node server for the token exchange. We know. We're sorry. The Vite config proxies `/api` requests to the token server automatically, so from your frontend's perspective, everything is at one URL. It's less annoying than it sounds.
:::

## 5. Test in Discord

1. Open the **Discord desktop app** (not the browser — Activities require the desktop client)
2. Join a **voice channel**
3. Click the **Activities** button (rocket icon) in the voice channel controls
4. Find and select your application
5. Your activity should load, authenticate, and show your username

## 6. Make Your First Change

Open `src/App.tsx` (or `.vue` / `.svelte` / `.ts` depending on your framework) and change the heading text. Save the file. Vite's HMR updates it instantly in Discord.

That's the DX. Change code → see it immediately → ship it.

If you made it through the setup, the hard part is over. Seriously.

---

**What's next?** → [Quick Start walkthrough](/guide/quick-start) to understand the code you just scaffolded.
