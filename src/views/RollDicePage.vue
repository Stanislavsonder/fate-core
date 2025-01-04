<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.roll-dice.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<DiceRoll />
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import DiceRoll from '@/components/DiceRoll.vue'
</script>
