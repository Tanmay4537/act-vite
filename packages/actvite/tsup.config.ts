import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        clean: true,
        outDir: 'dist',
        external: ['react', 'vue', 'svelte', '@discord/embedded-app-sdk'],
    },
    {
        entry: ['src/react/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        outDir: 'dist/react',
        external: ['react', 'vue', 'svelte', '@discord/embedded-app-sdk', 'actvite'],
        esbuildOptions(options) {
            options.jsx = 'automatic'
        },
    },
    {
        entry: ['src/vue/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        outDir: 'dist/vue',
        external: ['react', 'vue', 'svelte', '@discord/embedded-app-sdk', 'actvite'],
    },
    {
        entry: ['src/svelte/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        outDir: 'dist/svelte',
        external: ['react', 'vue', 'svelte', '@discord/embedded-app-sdk', 'actvite'],
    },
])
