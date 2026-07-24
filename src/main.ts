import '@/modules' // TODO(phase-2): replace with `await initMods()`
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { IonicVue } from '@ionic/vue'
import '@/styles/index.css'
import i18n from '@/i18n'
import { createPinia } from 'pinia'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { showErrorToast } from '@/utils/helpers/toast'

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

router.isReady().then(() => {
	app.mount('#app')
})
