<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.character.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title
						size="large"
						class="px-4"
						>{{ $t('tabs.character.title') }}</ion-title
					>
				</ion-toolbar>
			</ion-header>

			<CharacterSheet/>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import CharacterSheet from '@/components/CharacterSheet/CharacterSheet.vue'
</script>
