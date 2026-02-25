import React from 'react'
import ReactDOM from 'react-dom/client'
import { ActivityProvider } from 'actvite/react'
import { App } from './App'
import './style.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <ActivityProvider
            clientId={import.meta.env.VITE_DISCORD_CLIENT_ID ?? ''}
            fallback={<div className="loading">⏳ Connecting...</div>}
        >
            <App />
        </ActivityProvider>
    </React.StrictMode>,
)
