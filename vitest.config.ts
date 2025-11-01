import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	plugins: [vue()],
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
