// packages/create-actvite/src/prompts.ts

import { intro, outro, text, select, multiselect, spinner, note, cancel } from '@clack/prompts'
import pc from 'picocolors'

/**
 * Result of the interactive CLI prompts.
 * @internal
 */
export interface PromptResult {
    projectName: string
    framework: string
    serverFramework: string
    extras: string[]
}

/**
 * Run the interactive CLI prompts.
 * @returns The user's chosen project configuration
 * @internal
 */
export async function runPrompts(): Promise<PromptResult> {
    console.log('')
    intro(pc.bgMagenta(pc.white(pc.bold(' create-actvite '))))
    note(
        'The fastest way to start a Discord Activity.\nBuilt with Act-Vite — https://actvite.dev',
        'Welcome',
    )

    // Project name
    const projectName = await text({
        message: 'What is your project name?',
        placeholder: 'my-discord-activity',
        validate(value) {
            if (!value) return 'Project name is required.'
            if (!/^[a-z0-9-_]+$/i.test(value))
                return 'Use only letters, numbers, dashes, and underscores.'
        },
    })

    if (typeof projectName !== 'string') {
        cancel('Setup cancelled.')
        process.exit(0)
    }

    // Framework selection
    const framework = await select({
        message: 'Which frontend framework will you use?',
        options: [
            { value: 'react-ts', label: 'React + TypeScript', hint: 'Recommended' },
            { value: 'react-js', label: 'React + JavaScript' },
            { value: 'vue-ts', label: 'Vue 3 + TypeScript' },
            { value: 'svelte-ts', label: 'Svelte + TypeScript' },
            { value: 'vanilla-ts', label: 'Vanilla TypeScript' },
        ],
    })

    if (typeof framework !== 'string') {
        cancel('Setup cancelled.')
        process.exit(0)
    }

    // Server framework
    const serverFramework = await select({
        message: 'Which server framework for token exchange?',
        options: [
            { value: 'express', label: 'Express', hint: 'Most popular' },
            { value: 'hono', label: 'Hono', hint: 'Lightweight, edge-ready' },
            { value: 'fastify', label: 'Fastify', hint: 'High performance' },
        ],
    })

    if (typeof serverFramework !== 'string') {
        cancel('Setup cancelled.')
        process.exit(0)
    }

    // Extras
    const extras = await multiselect({
        message: 'Select additional features:',
        options: [
            { value: 'multiplayer', label: 'Multiplayer / Shared State', hint: 'actvite-multiplayer' },
            { value: 'eslint', label: 'ESLint + Prettier' },
            { value: 'examples', label: 'Include example code' },
        ],
        required: false,
    })

    return {
        projectName,
        framework: framework as string,
        serverFramework: serverFramework as string,
        extras: Array.isArray(extras) ? (extras as string[]) : [],
    }
}
