import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { invertMode, moon, sunny } from 'ionicons/icons'
import { StatusBar, Style } from '@capacitor/status-bar'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { isAndroid, isWeb } from '@/utils/helpers/platform'

type ThemeMode = 'system' | 'light' | 'dark'

const ANDROID_LIGHT_STATUS_BAR_COLOR = '#f5f5f5'
const ANDROID_DARK_STATUS_BAR_COLOR = '#1f1f1f'

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
	isAndroid && EdgeToEdge.setBackgroundColor({ color: isDarkMode.value ? ANDROID_DARK_STATUS_BAR_COLOR : ANDROID_LIGHT_STATUS_BAR_COLOR })
	!isWeb && StatusBar.setStyle({ style: isDarkMode.value ? Style.Dark : Style.Light })

	watch(isDarkMode, shouldEnable => {
		document.documentElement.classList.toggle('ion-palette-dark', shouldEnable)
		isAndroid && EdgeToEdge.setBackgroundColor({ color: isDarkMode.value ? ANDROID_DARK_STATUS_BAR_COLOR : ANDROID_LIGHT_STATUS_BAR_COLOR })
		!isWeb && StatusBar.setStyle({ style: isDarkMode.value ? Style.Dark : Style.Light })
	})

	function setTheme(newTheme: ThemeMode) {
		theme.value = newTheme
	}

	watch(theme, newTheme => {
		localStorage.setItem('theme', newTheme)
	})

	return { isDarkMode, theme, setTheme }
}
