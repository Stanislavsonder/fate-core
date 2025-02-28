<script setup lang="ts">
import { IonButton, IonList } from '@ionic/vue'
import type { DiceSceneConfig } from '@/dice/types'
import { DEFAULT_DICE_SCENE_CONFIG } from '@/dice/constants'
import { computed } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import DiceTypeSelect from '@/dice/components/RollConfig/parts/DiceTypeSelect.vue'
import GeneralConfig from '@/dice/components/RollConfig/parts/GeneralConfig.vue'
import PhysicsConfig from '@/dice/components/RollConfig/parts/PhysicsConfig.vue'

const isOpen = defineModel<boolean>('isOpen', {
	default: false
})

const config = defineModel<DiceSceneConfig>({
	required: true
})

const isDefaultConfig = computed(() => {
	return JSON.stringify(config.value) === JSON.stringify(DEFAULT_DICE_SCENE_CONFIG)
})

function reset() {
	config.value.numberOfDice = DEFAULT_DICE_SCENE_CONFIG.numberOfDice
	config.value.force = DEFAULT_DICE_SCENE_CONFIG.force
	config.value.scale = DEFAULT_DICE_SCENE_CONFIG.scale
	config.value.gravity = DEFAULT_DICE_SCENE_CONFIG.gravity
	config.value.haptic = DEFAULT_DICE_SCENE_CONFIG.haptic
	config.value.shake = DEFAULT_DICE_SCENE_CONFIG.shake
	config.value.showResult = DEFAULT_DICE_SCENE_CONFIG.showResult
	localStorage.removeItem('dice-roll-config')
}
</script>

<template>
	<ModalWindow
		v-model="isOpen"
		:title="$t('roll-dice.config.title')"
	>
		<ion-list>
			<DiceTypeSelect v-model="config" />

			<GeneralConfig v-model="config" />

			<PhysicsConfig v-model="config" />
		</ion-list>

		<ion-button
			:disabled="isDefaultConfig"
			class="mb-5"
			fill="clear"
			expand="full"
			color="danger"
			@click="reset"
		>
			{{ $t('roll-dice.config.reset') }}
		</ion-button>
	</ModalWindow>
</template>
