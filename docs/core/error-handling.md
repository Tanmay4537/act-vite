# Error Handling

Act-Vite provides descriptive, actionable error messages.

## ActivityError

All errors thrown by Act-Vite are instances of `ActivityError`:

```ts
import { ActivityError } from 'actvite'

try {
  const activity = await createActivity({ clientId: '' })
} catch (err) {
  if (err instanceof ActivityError) {
    console.log(err.code)     // 'MISSING_CLIENT_ID'
    console.log(err.docsUrl)  // 'https://actvite.dev/docs/errors#MISSING_CLIENT_ID'
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `MISSING_CLIENT_ID` | `clientId` was not provided to `createActivity()` |
| `AUTH_FAILED` | OAuth2 authorization or authentication failed |
| `TOKEN_EXCHANGE_FAILED` | Token exchange with your server failed |
| `SDK_NOT_READY` | Attempted to use the SDK before initialization |
| `INVALID_CONFIG` | Configuration object is invalid |
| `NETWORK_ERROR` | Network request failed during initialization |
| `PARTICIPANTS_UNAVAILABLE` | Could not fetch participant list |

## Error Callbacks

Use the `onError` callback for centralized error handling:

```ts
const activity = await createActivity({
  clientId: '...',
  onError: (error) => {
    // Log to your error tracking service
    reportError(error)
  },
})
```

## Human-Readable Messages

Every error includes:
- A clear description of what went wrong
- Suggested fixes
- A link to the relevant documentation

```
[actvite] Token exchange with your server failed.
  → Ensure your token exchange server is running
  → Check the tokenRoute option in your config
  → Your server must accept POST /api/token with { code } and return { access_token }
Docs: https://actvite.dev/docs/errors#TOKEN_EXCHANGE_FAILED
```
