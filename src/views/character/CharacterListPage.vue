<script setup lang="ts">
import { isIos } from '@/utils/helpers/platform'
import { IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, IonPage } from '@ionic/vue'
import CharacterList from '@/components/ChracterList/CharacterList.vue'
import { ROUTES } from '@/router'
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button
						:default-href="ROUTES.CHARACTER_SHEET"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
				<ion-title>{{ $t('character.your-characters') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterList />
		</ion-content>
	</ion-page>
</template>
