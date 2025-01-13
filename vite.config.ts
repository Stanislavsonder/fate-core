/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// @ts-ignore
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), legacy(), tailwindcss()],
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
