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
			<ion-fab-button
				:aria-label="
					$t('roll-dice.throw', {
						value: config.numberOfDice
					})
				"
				@click="handleThrow"
			>
				<ion-icon
					:icon="dice"
					aria-hidden="true"
				/>
			</ion-fab-button>
		</ion-fab>
		<p
			aria-live="polite"
			class="sr-only"
		>
			{{ $t('roll-dice.result', { value: rollResult }) }}
		</p>
	</div>
</template>

<script setup lang="ts">
import useDiceScene, { DiceSceneConfig } from '@/composables/useDiceScene.js'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { dice } from 'ionicons/icons'
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue'
import usePermission from '@/composables/usePermission.js'

const { requestMotionPermission } = usePermission()

const route = useRoute()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const rollResult = ref<number>(0)
const config = defineModel<DiceSceneConfig>({ required: true })

const { freeze, unfreeze, throwDice } = useDiceScene(config, canvasRef)

watch(route, () => {
	if (route.path === '/tabs/roll-dice') {
		unfreeze()
	} else {
		freeze()
	}
})

async function handleThrow() {
	await requestMotionPermission()
	rollResult.value = throwDice()
}
</script>
