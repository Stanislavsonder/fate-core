<script setup lang="ts">
import { IonList } from '@ionic/vue'
import type { DiceSceneConfig } from '@/dice/types'
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
	</ModalWindow>
</template>
