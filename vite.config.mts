/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [vue(), legacy({ targets: ['defaults', 'ie >= 11'] }), tailwindcss(), VitePWA({ registerType: 'autoUpdate', manifest: false }), tsconfigPaths()],
})
