import { useEffect, useState } from 'react'
import { useActivity, useParticipants, useCurrentUser } from 'actvite/react'
import { createSharedState, type SharedState } from 'actvite-multiplayer'

export function App() {
    const activity = useActivity()
    const user = useCurrentUser()
    const participants = useParticipants()
    const [state, setState] = useState<SharedState<{ score: number; lastClicker: string }> | null>(null)
    const [score, setScore] = useState(0)
    const [lastClicker, setLastClicker] = useState('')

    useEffect(() => {
        const sharedState = createSharedState(
            { score: 0, lastClicker: '' },
            {
                wsUrl: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
                roomId: activity.channel?.id ?? 'default',
            },
        )

        sharedState.subscribe('score', (val) => setScore(val))
        sharedState.subscribe('lastClicker', (val) => setLastClicker(val))

        setState(sharedState)

        return () => { sharedState.destroy() }
    }, [activity])

    const handleClick = () => {
        if (!state) return
        state.set('score', state.get('score') + 1)
        state.set('lastClicker', user.globalName ?? user.username)
    }

    const handleReset = () => {
        if (!state) return
        state.reset()
    }

    return (
        <div className="container">
            <h1>🎯 Multiplayer Counter</h1>

            <div className="score-card">
                <div className="score">{score}</div>
                <p className="last-clicker">
                    {lastClicker ? `Last click by ${lastClicker}` : 'Click the button!'}
                </p>
                <button className="click-btn" onClick={handleClick}>
                    +1
                </button>
                <button className="reset-btn" onClick={handleReset}>
                    Reset
                </button>
            </div>

            <div className="card">
                <h2>👥 Players ({participants.length})</h2>
                <div className="avatars">
                    {participants.map((p) => (
                        <div key={p.user.id} className="avatar-chip">
                            <img src={p.avatarUrl} alt={p.user.username} />
                            <span>{p.user.globalName ?? p.user.username}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
