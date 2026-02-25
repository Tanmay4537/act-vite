---
layout: home

hero:
  name: "Act-Vite"
  text: "Discord Activities,\nwithout the headache."
  tagline: "Act-Vite handles OAuth, proxying, and participant tracking so you can spend your time building — not debugging Discord's iframe quirks at 11pm."
  image:
    src: /logo.svg
    alt: Act-Vite Logo
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/actvite/actvite
    - theme: alt
      text: ⭐ Star Us
      link: https://github.com/actvite/actvite/stargazers

features:
  - icon: 🚀
    title: Zero to Activity in 60 Seconds
    details: Run npx create-actvite and you'll have a working, authenticated Discord Activity before your coffee finishes brewing.
  - icon: 🔐
    title: Auth Just Works
    details: OAuth2, token exchange, iframe proxying — all handled. You write the fun stuff. We handle the plumbing.
  - icon: 🧩
    title: Framework Agnostic
    details: React, Vue, Svelte, or Vanilla. Act-Vite doesn't care. Use whatever makes you happy. We're not judging.
  - icon: 🔷
    title: TypeScript First
    details: Full types, full autocomplete, zero any. Your editor will actually know what's going on for once.
  - icon: 👥
    title: Multiplayer Ready
    details: Optional shared state that syncs across all participants. Building a multiplayer game? We've got you.
  - icon: 💜
    title: Built with Love
    details: Real devs spent real hours on this. It shows. And if it helped you, please star the repo. Seriously.
---

## Quick Look

Here's what building a Discord Activity looks like **without** Act-Vite vs. **with** it.

*(The following code is legally required to be shown for trauma-bonding purposes.)*

**Before — Raw Discord SDK (~40 lines of ceremony):**

```ts
import { DiscordSDK } from '@discord/embedded-app-sdk'

const sdk = new DiscordSDK(CLIENT_ID)
await sdk.ready()

const { code } = await sdk.commands.authorize({
  client_id: CLIENT_ID,
  response_type: 'code',
  state: '',
  prompt: 'none',
  scope: ['identify', 'rpc.activities.write'],
})

const res = await fetch('/api/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code }),
})
const { access_token } = await res.json()

const auth = await sdk.commands.authenticate({ access_token })
// Now you can FINALLY use the SDK
// ...but you still need to set up participant tracking,
// patch URL mappings, handle errors, build user objects...
// You get the idea.
```

**After — With Act-Vite (5 lines):**

```ts
import { createActivity } from 'actvite'

const activity = await createActivity({
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
})

console.log(`Hello, ${activity.user.username}!`)
console.log(`${activity.participants.length} people are here`)
```

Same result. 5 lines. No boilerplate. No tears.

## Why Act-Vite?

Discord's Embedded App SDK is powerful — but raw. There's a lot of ceremony to get a basic activity running: initialize the SDK, wait for ready, authorize, exchange the code for a token on your server, authenticate with the token, patch URL mappings for the iframe proxy, fetch channel info, track participants...

**Act-Vite was built because we got tired of copy-pasting the same auth boilerplate into every project.** After the third time writing the same 40 lines of OAuth setup, we figured: what if there was a `createActivity()` that just... did all of it?

It's not trying to hide Discord's API from you — the raw SDK is always accessible via `activity.sdk`. Act-Vite just gives you a massive head start so you can spend your time building the actual experience.

*If you've ever stared at a blank `discordSdk.ready()` callback wondering what to do next, you're in the right place.*

<div class="cta-card">

## A Note from the Devs

Act-Vite is free, open source, and built entirely on spare time and questionable amounts of coffee.

If it saved you even one hour of debugging Discord's iframe quirks, we'd love a ⭐ on GitHub. It costs nothing, takes two seconds, and it genuinely motivates us to keep improving the framework.

No pressure. But also, a little pressure. Just kidding. *(Please star it.)*

[⭐ Star Act-Vite on GitHub →](https://github.com/actvite/actvite)

</div>
