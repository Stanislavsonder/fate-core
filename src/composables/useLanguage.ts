import { useI18n } from 'vue-i18n'
import { onMounted, watch } from 'vue'
import { getTextDirection } from '@/i18n/constants.js'

export default function useLanguage() {
	const { locale } = useI18n()

	onMounted(() => {
		const savedLocale = localStorage.getItem('locale')

		if (savedLocale) {
			locale.value = savedLocale
			document.documentElement.setAttribute('dir', getTextDirection(savedLocale))
		}
	})

	watch(locale, newLocale => {
		localStorage.setItem('locale', newLocale)
		document.documentElement.setAttribute('dir', getTextDirection(newLocale))
	})
}
