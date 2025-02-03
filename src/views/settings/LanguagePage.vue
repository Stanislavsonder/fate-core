<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/vue'
import { isIos } from '@/utils/helpers/platform'
import { ROUTES } from '@/router'
import LanguageList from '@/components/LanguageList/LanguageList.vue'
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
				<ion-title class="px-4">{{ $t('settings.language') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<LanguageList
				inset
				radio
			/>
		</ion-content>
	</ion-page>
</template>
