import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { IonicVue } from '@ionic/vue'
import '@/styles/index.css'
import i18n from '@/i18n'
import { createPinia } from 'pinia'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { showErrorToast } from '@/utils/helpers/toast'
import { initMods } from '@/mods/loader'
import { applyPersistedSkin } from '@/composables/useSkins'
import { installFateSDK } from '@/mods/sdk'

installFateSDK()

defineCustomElements(window)
const pinia = createPinia()
const app = createApp(App).use(IonicVue).use(i18n).use(router).use(pinia)

app.config.errorHandler = (err, instance, info) => {
	console.error('[Vue error]', err, info)
	showErrorToast('errors.unexpected')
}

window.addEventListener('error', event => {
	console.error('[Uncaught error]', event.error ?? event.message)
	showErrorToast('errors.unexpected')
})

window.addEventListener('unhandledrejection', event => {
	console.error('[Unhandled rejection]', event.reason)
	showErrorToast('errors.unexpected')
})

// initMods() registers built-ins first, then loads any installed external
// mods — every failure along the way is quarantined internally, never thrown,
// but `.finally` here is the last line of defense: even a catastrophic loader
// failure must still mount the app with built-ins only (README.md cross-phase
// rules 2 and 3).
initMods().finally(() => {
	applyPersistedSkin()
	router.isReady().then(() => app.mount('#app'))
})
