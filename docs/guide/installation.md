# Installation

## Using the CLI (Recommended)

```bash
npx create-actvite my-activity
```

## Manual Installation

```bash
# Core package
pnpm add actvite

# Server helpers (pick one)
pnpm add actvite-server

# Optional: Multiplayer support
pnpm add actvite-multiplayer
```

## Peer Dependencies

The core `actvite` package has optional peer dependencies for framework bindings:

| Import Path | Required Peer |
|-------------|--------------|
| `actvite` | None |
| `actvite/react` | `react >= 18.0.0` |
| `actvite/vue` | `vue >= 3.0.0` |
| `actvite/svelte` | `svelte >= 4.0.0` |

## TypeScript

Act-Vite is written in TypeScript and ships with complete type declarations. No `@types/` package is needed.

Minimum TypeScript version: **5.0+**

## Node.js

Minimum Node.js version: **18.0+**
