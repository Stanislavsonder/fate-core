import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { invertMode, moon, sunny } from 'ionicons/icons'
import { StatusBar, Style } from '@capacitor/status-bar'
import { isWeb } from '@/utils/helpers/platform'

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

function applyStatusBar(isDark: boolean) {
	if (isWeb) {
		return
	}
	StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light })
	const color = getComputedStyle(document.documentElement).getPropertyValue('--ion-background-color').trim()
	if (color) {
		StatusBar.setBackgroundColor({ color })
	}
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
	applyStatusBar(isDarkMode.value)

	watch(isDarkMode, shouldEnable => {
		document.documentElement.classList.toggle('ion-palette-dark', shouldEnable)
		applyStatusBar(shouldEnable)
	})

	function setTheme(newTheme: ThemeMode) {
		theme.value = newTheme
	}

	watch(theme, newTheme => {
		localStorage.setItem('theme', newTheme)
	})

	return { isDarkMode, theme, setTheme }
}
