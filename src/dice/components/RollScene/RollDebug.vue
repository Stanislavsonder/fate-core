<script setup lang="ts">
import { debugEventName } from '@/dice/composables/useDiceMotion'
import { IonInput, IonButton } from '@ionic/vue'
import DebugPanel from '@/components/ui/DebugPanel.vue'
import type { DiceSceneConfig } from '@/dice/types'
import { ref } from 'vue'
import {
	DICE_MATERIALS,
	DICE_SHAPES,
	MIN_FORCE,
	MAX_FORCE,
	MAX_NUMBER_OF_DICE,
	MIN_NUMBER_OF_DICE,
	MIN_GRAVITY,
	MAX_GRAVITY,
	MIN_SCALE,
	MAX_SCALE
} from '@/dice/constants'
import { randomArrayValue, randomRange, randomSign } from '@/utils/helpers/random'

const config = defineModel<DiceSceneConfig>('config', { required: true })

const x = ref((MAX_FORCE + MIN_FORCE) / 2)
const y = ref((MAX_FORCE + MIN_FORCE) / 2)
const z = ref((MAX_FORCE + MIN_FORCE) / 2)

function handleDebugShake() {
	window.dispatchEvent(new CustomEvent(debugEventName, { detail: { acceleration: { x: x.value, y: y.value, z: z.value } } }))
}

function handleDebugRandom() {
	x.value = randomSign() * Math.floor(Math.random() * (MAX_FORCE - MIN_FORCE)) + MIN_FORCE
	y.value = randomSign() * Math.floor(Math.random() * (MAX_FORCE - MIN_FORCE)) + MIN_FORCE
	z.value = randomSign() * Math.floor(Math.random() * (MAX_FORCE - MIN_FORCE)) + MIN_FORCE
	handleDebugShake()
}

function handleDebugRandomConfig() {
	config.value.dice.material = randomArrayValue(Array.from(DICE_MATERIALS.values())).name
	config.value.dice.shape = randomArrayValue(Array.from(DICE_SHAPES.values())).name
	config.value.force = randomRange(MIN_FORCE, MAX_FORCE)
	config.value.numberOfDice = randomRange(MIN_NUMBER_OF_DICE, MAX_NUMBER_OF_DICE)
	config.value.gravity = randomRange(MIN_GRAVITY, MAX_GRAVITY)
	config.value.scale = randomRange(MIN_SCALE, MAX_SCALE)
}
</script>

<template>
	<DebugPanel
		title="Roll Debug"
		class="flex flex-col max-w-30"
	>
		<ion-input
			v-model="x"
			type="number"
			label="X"
		/>
		<ion-input
			v-model="y"
			type="number"
			label="Y"
		/>
		<ion-input
			v-model="z"
			type="number"
			label="Z"
		/>
		<ion-button
			size="small"
			fill="clear"
			@click="handleDebugShake"
		>
			SHAKE
		</ion-button>
		<ion-button
			size="small"
			fill="clear"
			@click="handleDebugRandom"
		>
			Random force
		</ion-button>
		<ion-button
			size="small"
			fill="clear"
			@click="handleDebugRandomConfig"
		>
			Random config
		</ion-button>
	</DebugPanel>
</template>
