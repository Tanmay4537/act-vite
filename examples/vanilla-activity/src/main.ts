import { createActivity } from 'actvite'

async function main() {
    const app = document.getElementById('app')!
    app.innerHTML = '<p style="color:#888;text-align:center;padding:2rem;">Connecting to Discord...</p>'

    try {
        const activity = await createActivity({
            clientId: (import.meta as any).env?.VITE_DISCORD_CLIENT_ID ?? '',
        })

        app.innerHTML = `
      <div style="font-family:sans-serif;background:#1a1a2e;color:#eee;min-height:100vh;display:flex;align-items:center;justify-content:center;">
        <div style="max-width:500px;width:100%;padding:1.5rem;text-align:center;">
          <h1 style="background:linear-gradient(135deg,#5865f2,#eb459e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">🎮 Vanilla Activity</h1>
          <div style="background:rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;margin:1rem 0;">
            <img src="${activity.user.avatarUrl}" alt="${activity.user.username}" style="width:72px;height:72px;border-radius:50%;border:3px solid #5865f2;" />
            <h2>${activity.user.globalName ?? activity.user.username}</h2>
            <p style="color:#aaa;">Playing in ${activity.channel?.name ?? 'a channel'}</p>
          </div>
          <div style="background:rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;">
            <h3>Players (<span id="count">${activity.participants.length}</span>)</h3>
            <div id="players"></div>
          </div>
        </div>
      </div>
    `

        const renderPlayers = (participants: typeof activity.participants) => {
            const el = document.getElementById('players')!
            const count = document.getElementById('count')!
            count.textContent = String(participants.length)
            el.innerHTML = participants.map(p => `
        <span style="display:inline-flex;align-items:center;gap:0.4rem;background:rgba(88,101,242,0.2);padding:0.4rem 0.8rem;border-radius:999px;margin:0.25rem;font-size:0.85rem;">
          <img src="${p.avatarUrl}" alt="${p.user.username}" style="width:24px;height:24px;border-radius:50%;" />
          ${p.user.globalName ?? p.user.username}
        </span>
      `).join('')
        }

        renderPlayers(activity.participants)
        activity.onParticipantsChange(renderPlayers)
    } catch (err) {
        app.innerHTML = `<p style="color:#eb459e;text-align:center;padding:2rem;">Error: ${err instanceof Error ? err.message : String(err)}</p>`
    }
}

main()
