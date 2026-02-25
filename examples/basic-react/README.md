# Basic React Activity

A minimal Discord Activity built with Act-Vite and React.

## Features

- Displays the authenticated user's avatar and name
- Shows all participants in a lobby-style list
- Displays channel and guild information

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

4. In a separate terminal, start the token exchange server (see the main project's server guide).

5. Configure URL mappings in the Discord Developer Portal.

## Stack

- React 18 + TypeScript
- Vite
- Act-Vite (`actvite/react`)
