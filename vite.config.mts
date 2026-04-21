/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [
		vue(),
		legacy({ targets: ['defaults', 'ie >= 11'] }),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: false,
			workbox: {
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
				navigateFallback: '/index.html',
				navigateFallbackDenylist: [/^\/api/],
				runtimeCaching: [
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'images',
							expiration: {
								maxEntries: 60,
								maxAgeSeconds: 30 * 24 * 60 * 60
							}
						}
					}
				]
			},
			devOptions: {
				enabled: false
			}
		}),
		tsconfigPaths()
	],
})
