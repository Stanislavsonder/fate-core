import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import '@/styles/index.css'
import i18n from '@/i18n'

const app = createApp(App).use(IonicVue).use(i18n).use(router)

router.isReady().then(() => {
	app.mount('#app')
})
