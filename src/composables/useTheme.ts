import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { invertMode, moon, sunny } from 'ionicons/icons'
import { SystemBars, SystemBarsStyle, registerPlugin } from '@capacitor/core'
import { StatusBar } from '@capacitor/status-bar'
import { isAndroid, isWeb } from '@/utils/helpers/platform'

interface WindowBackgroundPlugin {
	setColor(options: { color: string }): Promise<void>
}

const WindowBackground = registerPlugin<WindowBackgroundPlugin>('WindowBackground')

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
	SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light })

	const color = getComputedStyle(document.documentElement).getPropertyValue('--ion-background-color').trim()
	if (!color) {
		return
	}

	// Android 15+ forbids apps from coloring the status/nav bars directly (they're
	// transparent overlays), so we paint the window's own background instead - it's
	// what shows through in the gap between the WebView and the screen edges.
	if (isAndroid) {
		WindowBackground.setColor({ color })
	} else {
		// iOS isn't restricted the same way - the status bar plugin can still color
		// its background view directly (overlaysWebView is false in capacitor.config.ts).
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
