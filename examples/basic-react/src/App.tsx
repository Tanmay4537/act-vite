import { useActivity, useParticipants, useCurrentUser } from 'actvite/react'

export function App() {
    const activity = useActivity()
    const user = useCurrentUser()
    const participants = useParticipants()

    return (
        <div className="container">
            <h1>🎮 Basic React Activity</h1>

            <div className="card">
                <img className="avatar" src={user.avatarUrl} alt={user.username} />
                <div className="username">{user.globalName ?? user.username}</div>
                <p className="subtitle">
                    Playing in <strong>{activity.channel?.name ?? 'a channel'}</strong>
                </p>
            </div>

            <div className="card">
                <h2>👥 Participants ({participants.length})</h2>
                <ul className="participant-list">
                    {participants.map((p) => (
                        <li key={p.user.id} className="participant">
                            <img src={p.avatarUrl} alt={p.user.username} />
                            <span>{p.user.globalName ?? p.user.username}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card">
                <h2>📋 Activity Info</h2>
                <table className="info-table">
                    <tbody>
                        <tr>
                            <td>User ID</td>
                            <td><code>{user.id}</code></td>
                        </tr>
                        <tr>
                            <td>Channel</td>
                            <td><code>{activity.channel?.id ?? 'N/A'}</code></td>
                        </tr>
                        <tr>
                            <td>Guild</td>
                            <td><code>{activity.guild?.id ?? 'N/A'}</code></td>
                        </tr>
                        <tr>
                            <td>Embedded</td>
                            <td>{activity.isEmbedded ? '✅ Yes' : '❌ No'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
