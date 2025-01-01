<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.character.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterSheet class="bg-background" />
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonTitle, IonHeader, IonToolbar } from '@ionic/vue'
import CharacterSheet from '@/components/CharacterSheet/CharacterSheet.vue'
</script>
