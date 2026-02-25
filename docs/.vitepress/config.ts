import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'Act-Vite',
    description: 'The Discord Activity framework. Build embedded apps with confidence.',
    base: '/actvite/',

    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/actvite/logo.svg' }],
        ['meta', { name: 'theme-color', content: '#5865F2' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Act-Vite' }],
        ['meta', { property: 'og:description', content: 'The Discord Activity framework.' }],
    ],

    themeConfig: {
        logo: '/logo.svg',
        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API Reference', link: '/api/reference' },
            { text: 'Examples', link: 'https://github.com/actvite/actvite/tree/main/examples' },
            {
                text: 'v0.1.0',
                items: [
                    { text: 'Changelog', link: '/changelog' },
                    { text: 'npm', link: 'https://npmjs.com/package/actvite' },
                ],
            },
        ],
        sidebar: {
            '/': [
                {
                    text: 'Introduction',
                    items: [
                        { text: 'What is Act-Vite?', link: '/guide/what-is-actvite' },
                        { text: 'Getting Started', link: '/guide/getting-started' },
                        { text: 'Quick Start', link: '/guide/quick-start' },
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Project Structure', link: '/guide/project-structure' },
                    ],
                },
                {
                    text: 'Core',
                    items: [
                        { text: 'createActivity()', link: '/core/create-activity' },
                        { text: 'Configuration', link: '/core/configuration' },
                        { text: 'Authentication', link: '/core/authentication' },
                        { text: 'Error Handling', link: '/core/error-handling' },
                    ],
                },
                {
                    text: 'Framework Bindings',
                    items: [
                        { text: 'React', link: '/frameworks/react' },
                        { text: 'Vue', link: '/frameworks/vue' },
                        { text: 'Svelte', link: '/frameworks/svelte' },
                    ],
                },
                {
                    text: 'Server',
                    items: [
                        { text: 'Overview', link: '/server/overview' },
                        { text: 'Express', link: '/server/express' },
                        { text: 'Hono', link: '/server/hono' },
                        { text: 'Fastify', link: '/server/fastify' },
                    ],
                },
                {
                    text: 'Multiplayer',
                    items: [
                        { text: 'Overview', link: '/multiplayer/overview' },
                        { text: 'Shared State', link: '/multiplayer/shared-state' },
                        { text: 'Rooms', link: '/multiplayer/rooms' },
                    ],
                },
                {
                    text: 'CLI',
                    items: [
                        { text: 'create-actvite', link: '/cli/create-actvite' },
                    ],
                },
                {
                    text: 'API Reference',
                    items: [
                        { text: 'Full Reference', link: '/api/reference' },
                    ],
                },
            ],
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/actvite/actvite' }],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2026 Act-Vite Contributors',
        },
        search: { provider: 'local' },
        editLink: {
            pattern: 'https://github.com/actvite/actvite/edit/main/docs/:path',
            text: 'Edit this page on GitHub',
        },
    },
})
