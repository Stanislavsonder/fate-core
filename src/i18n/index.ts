import { createI18n } from 'vue-i18n'
import en from './locales/en.json' with { type: 'json' }
import ru from './locales/ru.json' with { type: 'json' }

const i18n = createI18n({
	locale: localStorage.getItem('locale') || 'en',
	fallbackLocale: 'en',
	messages: {
		en,
		ru
	}
})

export default i18n
