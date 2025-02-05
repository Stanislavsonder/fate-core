<script setup lang="ts">
import { IonPage, IonContent, IonTitle, IonHeader, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/vue'
import CharacterSheet from '@/components/CharacterSheet/CharacterSheet.vue'
import { people } from 'ionicons/icons'
import { ROUTES } from '@/router'
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">
					{{ $t('tabs.character.title') }}
				</ion-title>
				<ion-buttons slot="end">
					<ion-button :router-link="ROUTES.CHARACTER_LIST">
						<ion-icon
							slot="icon-only"
							:icon="people"
						/>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterSheet class="bg-background" />
		</ion-content>
	</ion-page>
</template>
