/// <reference types="vitest" />
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), legacy(), tailwindcss(), VitePWA({ registerType: 'autoUpdate', manifest: false })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	// @ts-ignore
	test: {
		globals: true,
		environment: 'jsdom'
	}
})
