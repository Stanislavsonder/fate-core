/// <reference types="vitest" />
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), legacy(), tailwindcss(), VitePWA({ registerType: 'autoUpdate', manifest: false }), tsconfigPaths()],
	test: {
		include: ['src/tests/unit/**/*.test.ts'],
		globals: true,
		environment: 'jsdom'
	}
})
