import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
	test: {
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/tests/unit/**/*.test.ts'],
		environment: 'jsdom'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})
