import { Capacitor } from '@capacitor/core'

async function unregisterServiceWorkers(): Promise<void> {
	if (!('serviceWorker' in navigator)) {
		return
	}

	const registrations = await navigator.serviceWorker.getRegistrations()
	await Promise.all(registrations.map(registration => registration.unregister()))
}

async function deleteCacheStorage(): Promise<void> {
	if (!('caches' in window)) {
		return
	}

	const keys = await caches.keys()
	await Promise.all(keys.map(key => caches.delete(key)))
}

function registerWebServiceWorker(): void {
	if (!('serviceWorker' in navigator)) {
		return
	}

	let refreshing = false
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (refreshing) {
			return
		}
		refreshing = true
		window.location.reload()
	})

	void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
		updateViaCache: 'none'
	})
}

export async function setupServiceWorker(): Promise<void> {
	if (Capacitor.isNativePlatform()) {
		await unregisterServiceWorkers()
		await deleteCacheStorage()
		return
	}

	registerWebServiceWorker()
}
