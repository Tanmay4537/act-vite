import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts', 'src/express.ts', 'src/hono.ts', 'src/fastify.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['express', 'hono', 'fastify'],
})
