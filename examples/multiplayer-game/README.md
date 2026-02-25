# Multiplayer Counter Game

A multiplayer counting game built with Act-Vite and `actvite-multiplayer`.

## Features

- Shared score synchronized across all participants
- Real-time participant tracking
- Click to increment, reset to zero
- Displays who clicked last

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file:

```env
VITE_DISCORD_CLIENT_ID=your_client_id_here
```

3. Start the dev server:

```bash
pnpm dev
```

4. Start the multiplayer WebSocket server and token exchange server.

## Stack

- React 18 + TypeScript
- Vite
- Act-Vite (`actvite/react`, `actvite-multiplayer`)
