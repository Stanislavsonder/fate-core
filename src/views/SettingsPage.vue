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
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue'
import { informationCircle, language, moon } from 'ionicons/icons'

const SETTINGS = [
	{
		title: 'settings.theme.title',
		icon: moon,
		route: '/tabs/settings/theme'
	},
	{
		title: 'settings.language',
		icon: language,
		route: '/tabs/settings/language'
	},
	{
		title: 'settings.about-app.title',
		icon: informationCircle,
		route: '/tabs/settings/about'
	}
]
</script>
