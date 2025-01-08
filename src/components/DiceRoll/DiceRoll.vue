<template>
	<div class="relative w-full h-full overflow-hidden bg-background">
		<canvas
			ref="canvasRef"
			class="w-full h-full block"
		/>
		<ion-fab
			slot="fixed"
			vertical="bottom"
			horizontal="center"
		>
			<ion-fab-button @click="handleThrow">
				<ion-icon :icon="dice" />
			</ion-fab-button>
		</ion-fab>
	</div>
</template>

<script setup lang="ts">
import useDiceScene, { DiceSceneConfig } from '@/composables/useDiceScene.js'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dice } from 'ionicons/icons'
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue'
import usePermission from '@/composables/usePermission.js'

const { config } = defineProps<{
	config: DiceSceneConfig
}>()
const { requestMotionPermission } = usePermission()

const route = useRoute()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const { freeze, unfreeze, throwDice } = useDiceScene(config, canvasRef)

watch(route, () => {
	if (route.path === '/tabs/roll-dice') {
		console.debug('[Unfreeze] Roll Dice page matched. Unfreezing scene...')
		unfreeze()
	} else {
		console.debug('[Unfreeze] Roll Dice page does not matched. Freezing scene...')
		freeze()
	}
})

async function handleThrow() {
	await requestMotionPermission()
	throwDice()
}
</script>
