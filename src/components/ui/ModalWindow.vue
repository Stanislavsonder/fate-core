<script setup lang="ts">
import { close } from 'ionicons/icons'
import { IonModal, IonIcon, IonHeader, IonButtons, IonButton, IonToolbar, IonContent, IonTitle } from '@ionic/vue'
import { computed, ref } from 'vue'

const {
	title = '',
	sheet = false,
	breakpoints = [0, 1],
	initialBreakpoint = 1
} = defineProps<{
	title?: string
	sheet?: boolean
	breakpoints?: number[]
	initialBreakpoint?: number
}>()

const modal = ref()

const isOpen = defineModel<boolean>({
	default: false
})

const style = computed(() => {
	if (sheet) {
		return {
			'--height': 'auto'
		}
	}
	return {}
})
</script>

<template>
	<ion-modal
		ref="modal"
		:style
		:initial-breakpoint="sheet ? initialBreakpoint : undefined"
		:breakpoints="sheet ? breakpoints : undefined"
		:is-open="isOpen"
		@will-dismiss="isOpen = false"
	>
		<template v-if="sheet">
			<slot />
		</template>
		<template v-else>
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
		</template>
	</ion-modal>
</template>
