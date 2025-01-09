<script setup lang="ts">
import { close } from 'ionicons/icons'
import { IonModal, IonIcon, IonHeader, IonButtons, IonButton, IonToolbar, IonContent, IonTitle } from '@ionic/vue'
import { ref } from 'vue'

const { title = '' } = defineProps<{
	title?: string
}>()

const modal = ref()
const isOpen = defineModel<boolean>({
	default: false
})
</script>

<template>
	<ion-modal
		ref="modal"
		:is-open="isOpen"
	>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="isOpen = false">
						<ion-icon :icon="close" />
					</ion-button>
				</ion-buttons>
				<ion-title>{{ title }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<slot />
		</ion-content>
	</ion-modal>
</template>
