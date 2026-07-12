<script setup lang="ts">
import { close } from 'ionicons/icons'
import { IonModal, IonIcon, IonHeader, IonButtons, IonButton, IonToolbar, IonContent, IonTitle } from '@ionic/vue'
import { computed, ref } from 'vue'

const {
	title = '',
	sheet = false,
	breakpoints = [0, 1],
	initialBreakpoint = 1,
	autoHeight = true
} = defineProps<{
	title?: string
	sheet?: boolean
	autoHeight?: boolean
	breakpoints?: number[]
	initialBreakpoint?: number
}>()

const modal = ref()

const isOpen = defineModel<boolean>({
	default: false
})

const style = computed(() => {
	if (sheet && autoHeight) {
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
			<div class="pb-[var(--ion-safe-area-bottom,0px)]">
				<slot />
			</div>
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
			<ion-content class="[--padding-bottom:var(--ion-safe-area-bottom,0px)]">
				<slot />
			</ion-content>
		</template>
	</ion-modal>
</template>
