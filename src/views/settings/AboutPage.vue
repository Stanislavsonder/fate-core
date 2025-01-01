<template>
		<ion-page>
			<ion-header>
				<ion-toolbar>
					<ion-buttons slot="start">
						<ion-back-button default-href="/tabs/settings" :text="isIos ? $t('tabs.settings.title') : undefined"/>
					</ion-buttons>
					<ion-title class="px-4">{{ $t('settings.about-app.title') }}</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content>
				<ion-list :inset="true">
					<ion-item>
						<ion-label>{{ $t('settings.about-app.version')}}</ion-label>
						<ion-note slot="end" class="text-sm self-center">{{ ABOUT_APP.version }}</ion-note>
					</ion-item>
					<ion-item>
						<ion-label>{{ $t('settings.about-app.author')}}</ion-label>
						<ion-note slot="end" class="text-sm self-center">
							{{ ABOUT_APP.author }}
						</ion-note>
					</ion-item>
					<ion-item href="https://opensource.org/license/mit"  :detail="false">
						<ion-label>{{ $t('settings.about-app.license')}}</ion-label>
						<ion-note slot="end" class="text-sm self-center flex gap-1 items-center">
							{{ ABOUT_APP.license}}
							<ion-icon class="text-lg" :icon="openOutline"/>
						</ion-note>
					</ion-item>
				</ion-list>
			</ion-content>
		</ion-page>
	</template>

<script setup lang="ts">
import { IonPage, IonItem, IonNote, IonLabel, IonIcon, IonList, IonContent, IonHeader, IonToolbar, IonBackButton, IonButtons, IonTitle } from '@ionic/vue'
import { version, author } from '@/../package.json'
import { openOutline } from 'ionicons/icons'
import { isIos } from '@/utils'

const ABOUT_APP = {
	version,
	author: author.name,
	license: 'MIT License'
}
</script>
