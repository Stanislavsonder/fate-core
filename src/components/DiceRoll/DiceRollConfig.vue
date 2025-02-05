<script setup lang="ts">
import { IonButton, IonList, IonItem, IonRange, IonToggle } from '@ionic/vue'
import {
	DEFAULT_DICE_SCENE_CONFIG,
	DiceSceneConfig,
	MAX_NUMBER_OF_DICE,
	MAX_FORCE,
	MAX_GRAVITY,
	MAX_SCALE,
	MIN_NUMBER_OF_DICE,
	MIN_FORCE,
	MIN_GRAVITY,
	MIN_SCALE
} from '@/composables/useDiceScene.js'
import { computed } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

const isOpen = defineModel<boolean>('isOpen', {
	default: false
})

const config = defineModel<DiceSceneConfig>({
	required: true
})

const isDefaultConfig = computed(() => {
	return (
		config.value.numberOfDice === DEFAULT_DICE_SCENE_CONFIG.numberOfDice &&
		config.value.force === DEFAULT_DICE_SCENE_CONFIG.force &&
		config.value.scale === DEFAULT_DICE_SCENE_CONFIG.scale &&
		config.value.gravity === DEFAULT_DICE_SCENE_CONFIG.gravity
	)
})

function reset() {
	config.value.numberOfDice = DEFAULT_DICE_SCENE_CONFIG.numberOfDice
	config.value.force = DEFAULT_DICE_SCENE_CONFIG.force
	config.value.scale = DEFAULT_DICE_SCENE_CONFIG.scale
	config.value.gravity = DEFAULT_DICE_SCENE_CONFIG.gravity
	config.value.haptic = DEFAULT_DICE_SCENE_CONFIG.haptic
	config.value.shake = DEFAULT_DICE_SCENE_CONFIG.shake
	localStorage.removeItem('dice-roll-config')
}
</script>

<template>
	<ModalWindow
		v-model="isOpen"
		sheet
		:title="$t('roll-dice.config.title')"
	>
		<ion-list>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.shake = e.detail.checked)"
			>
				<ion-toggle
					:checked="config.shake"
					class="mx-4"
				>
					{{ $t('roll-dice.config.shake') }}
				</ion-toggle>
			</ion-item>
			<ion-item @ion-change="(e: CustomEvent) => (config.haptic = e.detail.checked)">
				<ion-toggle
					:checked="config.haptic"
					class="mx-4"
				>
					{{ $t('roll-dice.config.haptic') }}
				</ion-toggle>
			</ion-item>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.numberOfDice = Number(e.detail.value) || DEFAULT_DICE_SCENE_CONFIG.numberOfDice)"
			>
				<ion-range
					:label="$t('roll-dice.config.number')"
					label-placement="stacked"
					:value="config.numberOfDice"
					:min="MIN_NUMBER_OF_DICE"
					:max="MAX_NUMBER_OF_DICE"
					:step="1"
					snaps
					pin
					ticks
				/>
			</ion-item>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.scale = Number(e.detail.value) || DEFAULT_DICE_SCENE_CONFIG.scale)"
			>
				<ion-range
					:value="config.scale"
					:label="$t('roll-dice.config.size')"
					label-placement="stacked"
					:min="MIN_SCALE"
					:max="MAX_SCALE"
					:step="2"
					snaps
					ticks
				/>
			</ion-item>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.force = Number(e.detail.value) || DEFAULT_DICE_SCENE_CONFIG.force)"
			>
				<ion-range
					:value="config.force"
					:label="$t('roll-dice.config.force')"
					label-placement="stacked"
					:min="MIN_FORCE"
					:max="MAX_FORCE"
					:step="1"
				/>
			</ion-item>
			<ion-item @ion-change="(e: CustomEvent) => (config.gravity = Number(e.detail.value) || DEFAULT_DICE_SCENE_CONFIG.gravity)">
				<ion-range
					:value="config.gravity"
					:label="$t('roll-dice.config.gravity')"
					label-placement="stacked"
					:min="MIN_GRAVITY"
					:max="MAX_GRAVITY"
					:step="5"
					snaps
					ticks
				/>
			</ion-item>
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
