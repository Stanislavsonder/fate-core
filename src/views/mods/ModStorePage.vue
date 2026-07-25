<script setup lang="ts">
import { ref } from 'vue'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue'
import { isIos } from '@/utils/helpers/platform'
import { ROUTES } from '@/router'
import ModStoreBrowseTab from './parts/ModStoreBrowseTab.vue'
import ModStoreInstalledTab from './parts/ModStoreInstalledTab.vue'

const tab = ref<'browse' | 'installed'>('browse')
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button
						:default-href="ROUTES.SETTINGS"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
				<ion-title class="px-4">{{ $t('settings.mods.title') }}</ion-title>
			</ion-toolbar>
			<ion-toolbar>
				<ion-segment v-model="tab">
					<ion-segment-button value="browse">
						<ion-label>{{ $t('settings.mods.tabs.browse') }}</ion-label>
					</ion-segment-button>
					<ion-segment-button value="installed">
						<ion-label>{{ $t('settings.mods.tabs.installed') }}</ion-label>
					</ion-segment-button>
				</ion-segment>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ModStoreBrowseTab v-if="tab === 'browse'" />
			<ModStoreInstalledTab v-else />
		</ion-content>
	</ion-page>
</template>
