# Project Structure

A typical Act-Vite project has the following structure:

```
my-activity/
├── src/
│   ├── main.tsx          # Application entry point
│   ├── App.tsx           # Main component
│   ├── style.css         # Styles
│   └── vite-env.d.ts     # Vite type declarations
├── server/
│   ├── index.ts          # Token exchange server
│   └── package.json      # Server dependencies
├── public/               # Static assets
├── .env                  # Discord credentials
├── index.html            # HTML entry
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite config
```

## Key Files

### `src/main.tsx`
The entry point that wraps your app with `<ActivityProvider>`.

### `server/index.ts`
A small server that handles the OAuth2 token exchange. This is where your `DISCORD_CLIENT_SECRET` is used — it must never be exposed to the client.

### `.env`
Your Discord credentials. Never commit this file.

### `vite.config.ts`
Configured with a proxy to route `/api` requests to your token exchange server during development.
