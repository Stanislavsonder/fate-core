import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { invertMode, moon, sunny } from 'ionicons/icons'
import { StatusBar, Style } from '@capacitor/status-bar'
import { isIos } from '@/utils/helpers/platform'

type ThemeMode = 'system' | 'light' | 'dark'

export const THEMES: { name: ThemeMode; icon: string }[] = [
	{
		name: 'system',
		icon: invertMode
	},
	{
		name: 'light',
		icon: sunny
	},
	{
		name: 'dark',
		icon: moon
	}
]

const theme = ref<ThemeMode>(getSavedTheme() || 'system')

function getSavedTheme(): ThemeMode | undefined {
	const savedTheme = localStorage.getItem('theme')
	if (savedTheme && THEMES.some(theme => theme.name === savedTheme)) {
		return savedTheme as ThemeMode
	}
	return undefined
}

export default function useTheme() {
	const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')

	const isDarkMode = computed<boolean>(() => {
		if (theme.value === 'system') {
			return isPreferredDark.value
		}
		return theme.value === 'dark'
	})

	document.documentElement.classList.toggle('ion-palette-dark', isDarkMode.value)
	if (isIos) {
		StatusBar.setStyle({ style: isDarkMode.value ? Style.Dark : Style.Light })
	}

	watch(isDarkMode, shouldEnable => {
		document.documentElement.classList.toggle('ion-palette-dark', shouldEnable)
		if (isIos) {
			StatusBar.setStyle({ style: isDarkMode.value ? Style.Dark : Style.Light })
		}
	})

	function setTheme(newTheme: ThemeMode) {
		theme.value = newTheme
	}

	watch(theme, newTheme => {
		localStorage.setItem('theme', newTheme)
	})

	return { isDarkMode, theme, setTheme }
}
