// packages/create-actvite/src/index.ts

import { outro, spinner } from '@clack/prompts'
import pc from 'picocolors'
import { note } from '@clack/prompts'
import { runPrompts } from './prompts.js'
import { scaffold } from './scaffold.js'

async function main() {
    const { projectName, framework, serverFramework, extras } = await runPrompts()

    const s = spinner()
    s.start('Creating your activity...')

    try {
        await scaffold({
            projectName,
            framework,
            serverFramework,
            extras,
            targetDir: `./${projectName}`,
        })

        s.stop('Activity created!')
        console.log('')
        note(
            [
                `cd ${projectName}`,
                `pnpm install`,
                ``,
                `# Add your Discord credentials to .env:`,
                `# DISCORD_CLIENT_ID=your_client_id`,
                `# DISCORD_CLIENT_SECRET=your_client_secret`,
                ``,
                `# Start the dev server:`,
                `pnpm dev`,
            ].join('\n'),
            'Next steps',
        )

        outro(`${pc.green('✓')} You're ready! Docs: ${pc.underline(pc.cyan('https://actvite.dev'))}`)
    } catch (err) {
        s.stop('Failed to create activity.')
        console.error(pc.red(String(err)))
        process.exit(1)
    }
}

main()
