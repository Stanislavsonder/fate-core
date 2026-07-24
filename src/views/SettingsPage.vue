<script setup lang="ts">
import { IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue'
import { informationCircle, language, moon, flaskOutline } from 'ionicons/icons'
import { ROUTES } from '@/router'
import useDebug from '@/composables/useDebug'

const { isDebug } = useDebug()

const SETTINGS = [
	{
		title: 'settings.theme.title',
		icon: moon,
		route: ROUTES.SETTINGS_THEME
	},
	{
		title: 'settings.language',
		icon: language,
		route: ROUTES.SETTINGS_LANGUAGE
	},
	{
		title: 'settings.about-app.title',
		icon: informationCircle,
		route: ROUTES.SETTINGS_ABOUT
	}
]

// Modules 2.0 Phase 0 spike — only visible once debug mode is enabled (About page, tap version 5x).
const DEBUG_SETTINGS = [
	{
		title: 'Modules 2.0 spike',
		icon: flaskOutline,
		route: ROUTES.SETTINGS_DEV_SPIKE
	}
]
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>{{ $t('tabs.settings.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">{{ $t('tabs.settings.title') }}</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-list inset>
				<ion-item
					v-for="page in SETTINGS"
					:key="page.route"
					:router-link="page.route"
					:button="true"
					detail
				>
					<ion-icon
						slot="start"
						:icon="page.icon"
						aria-hidden="true"
						class="mr-2"
					/>
					<ion-label>
						{{ $t(page.title) }}
					</ion-label>
				</ion-item>
			</ion-list>
			<ion-list
				v-if="isDebug"
				inset
			>
				<ion-item
					v-for="page in DEBUG_SETTINGS"
					:key="page.route"
					:router-link="page.route"
					:button="true"
					detail
				>
					<ion-icon
						slot="start"
						:icon="page.icon"
						aria-hidden="true"
						class="mr-2"
					/>
					<ion-label>
						{{ page.title }}
					</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>
