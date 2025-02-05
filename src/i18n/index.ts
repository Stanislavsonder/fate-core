import { createI18n } from 'vue-i18n'
import messages from './languages.json'

// prettier-ignore
export const AVAILABLE_LANGUAGES = [
	'en',	'fr',	'es',	'pt',	'it',
	'de',	'nl',	'sv',	'no',	'da',
	'fi',	'ru',	'be',	'uk',	'pl',
	'cs',	'ro',	'el',	'tr',	'he',
	'ar',	'fa',	'sw',	'zh',	'hi',
	'bn',	'ja',	'ko',	'id',	'th'
]

const i18n = createI18n({
	locale: localStorage.getItem('locale') || navigator.language.slice(0, 2),
	fallbackLocale: 'en',
	legacy: false,
	messages
})

export default i18n
