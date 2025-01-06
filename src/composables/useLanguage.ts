import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
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
}
