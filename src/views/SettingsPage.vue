<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.settings.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">{{ $t('tabs.settings.title') }}</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-list :inset="true">
				<ion-item v-for="page in SETTINGS" :key="page.route" :router-link="page.route" :button="true">
					<ion-icon slot="start" :icon="page.icon" aria-hidden="true" class="text-primary mr-2"/>
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
import { informationCircle, language } from 'ionicons/icons'


const SETTINGS = [
	{
		title: 'settings.language',
		icon: language,
		route: '/tabs/settings/language'
	},
	{
		title: 'settings.about-app',
		icon: informationCircle,
		route: '/tabs/settings/about'
	}
]
</script>
