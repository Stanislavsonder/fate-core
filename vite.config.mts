/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		vue(),
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
					},
					{
						// Defensive, not currently load-bearing: no other runtimeCaching
						// rule matches registry.json/mod artifacts today, so the SW
						// wouldn't cache them anyway. This exists so a future catch-all
						// runtimeCaching rule can't silently reintroduce a stale-cached
						// registry.json defeating registryClient.ts's own blocklist checks
						// — see planning/modules-2-0/phase-3-registry-store.md, Decision 6.
						urlPattern: /^https:\/\/stanislavsonder\.github\.io\/fate-core-mods\//,
						handler: 'NetworkOnly'
					}
				]
			},
			devOptions: {
				enabled: false
			}
		})
	],
	resolve: {
		tsconfigPaths: true
	}
})
