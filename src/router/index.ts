import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import AppTabs from '../views/AppTabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/character'
  },
	{
		path: '/tabs/',
		component: AppTabs,
		children: [
			{
				path: '',
				redirect: '/tabs/character'
			},
			{
				path: 'character',
				component: () => import('@/views/CharacterSheetPage.vue')
			},
			{
				path: 'roll-dice',
				component: () => import('@/views/RollDicePage.vue')
			},
			{
				path: 'settings',
				component: () => import('@/views/SettingsPage.vue'),
			},
			{
				path: 'settings/about',
				component: () => import('@/views/settings/AboutPage.vue'),
			},
			{
				path: 'settings/language',
				component: () => import('@/views/settings/LanguagePage.vue'),
			},
		]
	}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
