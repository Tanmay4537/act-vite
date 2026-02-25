# create-actvite CLI

Scaffold a new Act-Vite Discord Activity in seconds.

## Usage

```bash
npx create-actvite my-activity
```

## Interactive Prompts

The CLI will prompt you to configure:

1. **Project Name** — Name of the directory to create
2. **Frontend Framework** — React, Vue, Svelte, or Vanilla TypeScript
3. **Server Framework** — Express, Hono, or Fastify
4. **Additional Features** — Multiplayer, ESLint + Prettier, example code

## Options

| Framework | Label |
|-----------|-------|
| `react-ts` | React + TypeScript (Recommended) |
| `react-js` | React + JavaScript |
| `vue-ts` | Vue 3 + TypeScript |
| `svelte-ts` | Svelte + TypeScript |
| `vanilla-ts` | Vanilla TypeScript |

## Generated Structure

```
my-activity/
├── src/               # Frontend source
├── server/            # Token exchange server
├── public/            # Static assets
├── .env               # Discord credentials
├── index.html         # HTML entry
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── vite.config.ts     # Vite config
```

## After Scaffolding

```bash
cd my-activity
pnpm install
cd server && pnpm install && cd ..

# Add credentials to .env
# Start developing
pnpm dev
```
