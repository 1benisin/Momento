import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'edge-runtime',
    include: ['convex/**/*.test.{ts,mts,js}'],
    server: {deps: {inline: ['convex-test']}},
  },
})
