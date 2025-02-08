import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppTabs from '../views/AppTabs.vue'
import { DATE_KEY } from '@/composables/usePolicy'

export const ROUTES = {
	START_SCREEN: '/',
	TABS: '/tabs',
	CHARACTER_SHEET: '/tabs/character',
	CHARACTER_CREATE: '/tabs/character/create',
	CHARACTER_CONFIGURE: '/tabs/character/configure/:id',
	CHARACTER_LIST: '/tabs/character/list',
	ROLL_DICE: '/tabs/roll-dice',
	SETTINGS: '/tabs/settings',
	SETTINGS_ABOUT: '/tabs/settings/about',
	SETTINGS_PRIVACY_POLICY: '/tabs/settings/about/privacy-policy',
	SETTINGS_LANGUAGE: '/tabs/settings/language',
	SETTINGS_THEME: '/tabs/settings/theme'
}

function tabRoute(path: string) {
	return path.replace('/tabs/', '')
}

const routes: Array<RouteRecordRaw> = [
	{
		path: ROUTES.START_SCREEN,
		component: () => import('@/views/StartScreen.vue')
	},
	{
		path: ROUTES.TABS,
		component: AppTabs,
		children: [
			{
				path: '',
				redirect: ROUTES.CHARACTER_SHEET
			},
			{
				path: tabRoute(ROUTES.CHARACTER_SHEET),
				component: () => import('@/views/character/CharacterSheetPage.vue')
			},
			{
				path: tabRoute(ROUTES.CHARACTER_CREATE),
				component: () => import('@/views/character/CharacterCreatePage.vue')
			},
			{
				path: tabRoute(ROUTES.CHARACTER_CONFIGURE),
				component: () => import('@/views/character/CharacterConfigurePage.vue')
			},
			{
				path: tabRoute(ROUTES.CHARACTER_LIST),
				component: () => import('@/views/character/CharacterListPage.vue')
			},
			{
				path: tabRoute(ROUTES.ROLL_DICE),
				component: () => import('@/views/RollDicePage.vue')
			},
			{
				path: tabRoute(ROUTES.SETTINGS),
				component: () => import('@/views/SettingsPage.vue')
			},
			{
				path: tabRoute(ROUTES.SETTINGS_ABOUT),
				component: () => import('@/views/settings/AboutPage.vue')
			},
			{
				path: tabRoute(ROUTES.SETTINGS_PRIVACY_POLICY),
				component: () => import('@/views/settings/about/PrivacyPolicyPage.vue')
			},
			{
				path: tabRoute(ROUTES.SETTINGS_LANGUAGE),
				component: () => import('@/views/settings/LanguagePage.vue')
			},
			{
				path: tabRoute(ROUTES.SETTINGS_THEME),
				component: () => import('@/views/settings/ThemePage.vue')
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	if (to.path === ROUTES.START_SCREEN) {
		if (!localStorage.getItem(DATE_KEY)) {
			next()
		} else next(ROUTES.TABS)
	} else {
		if (!localStorage.getItem(DATE_KEY)) {
			next(ROUTES.START_SCREEN)
		} else next()
	}
})

export default router
