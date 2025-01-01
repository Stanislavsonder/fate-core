import { computed, shallowRef, watch } from 'vue'
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

const theme = shallowRef<ThemeMode>(getSavedTheme() || 'system');

function getSavedTheme(): ThemeMode | undefined {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme && THEMES.some((theme) => theme.name === savedTheme)) {
		return savedTheme as ThemeMode;
	}
	return undefined;
}



export default function useTheme() {
	const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')

	const isDarkMode = computed<boolean>(() => {
		if (theme.value === 'system') {
			return isPreferredDark.value;
		}
		return theme.value === 'dark';
	})

	document.documentElement.classList.toggle('ion-palette-dark', isDarkMode.value);

	watch(isDarkMode, (shouldEnable) => {
		document.documentElement.classList.toggle('ion-palette-dark', shouldEnable);
	})

	function setTheme(newTheme: ThemeMode) {
		theme.value = newTheme;
	}

	// Save-load theme from LocalStorage
	watch(theme, (newTheme) => {
		localStorage.setItem('theme', newTheme);
	})

	return { isDarkMode, theme, setTheme };
}
