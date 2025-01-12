import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { IonicVue } from '@ionic/vue'
import '@/styles/index.css'
import i18n from '@/i18n'
import { createPinia } from 'pinia'
import { defineCustomElements } from '@ionic/pwa-elements/loader'

defineCustomElements(window)
const pinia = createPinia()
const app = createApp(App).use(IonicVue).use(i18n).use(router).use(pinia)

router.isReady().then(() => {
	app.mount('#app')
})
