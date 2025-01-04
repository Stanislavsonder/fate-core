<template>
	<div class="relative w-full h-full overflow-hidden bg-background">
		<canvas
			ref="canvasRef"
			class="w-full h-full block"
		/>
		<ion-fab
			slot="fixed"
			vertical="bottom"
			horizontal="end"
		>
			<ion-fab-button @click="throwDice">
				<ion-icon :icon="dice" />
			</ion-fab-button>
		</ion-fab>
	</div>
</template>

<script setup lang="ts">
import useDiceScene from '@/composables/useDiceScene'
import { ref } from 'vue'
import { dice } from 'ionicons/icons'
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue'
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { throwDice } = useDiceScene(
	{
		diceCount: 4,
		scale: 6
	},
	canvasRef
)
</script>
