import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import {moon, sunny, invertMode } from 'ionicons/icons'

type ThemeMode = 'system' | 'light' | 'dark';

export const THEMES: { name: ThemeMode, icon: string }[] = [
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


export default function useTheme() {
	const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
	const theme = ref<ThemeMode>(getSavedTheme() || 'system');

	const isDarkMode = computed<boolean>(() => {
		if (theme.value === 'system') {
			return isPreferredDark.value;
		}
		return theme.value === 'dark';
	})

	document.documentElement.classList.toggle('ion-palette-dark', isDarkMode.value);

	watch(isDarkMode, (shouldEnable) => {
		if (shouldEnable === undefined) {
			shouldEnable = isPreferredDark.value;
		}
		document.documentElement.classList.toggle('ion-palette-dark', shouldEnable);
	})

	function setTheme(newTheme: ThemeMode) {
		theme.value = newTheme;
	}

	// Save-load theme from LocalStorage
	watch(theme, (newTheme) => {
		localStorage.setItem('theme', newTheme);
	})

	function getSavedTheme(): ThemeMode | undefined {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme && THEMES.some((theme) => theme.name === savedTheme)) {
			return savedTheme as ThemeMode;
		}
		return undefined;
	}

	return { isDarkMode, theme, setTheme };
}
