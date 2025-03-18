<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonRange, IonButton } from '@ionic/vue'
import type { DiceSceneConfig } from '@/dice/types'
import {
	DEFAULT_DICE_SCENE_CONFIG,
	MIN_NUMBER_OF_DICE,
	MAX_NUMBER_OF_DICE,
	MIN_SCALE,
	MAX_SCALE,
	MIN_FORCE,
	MAX_FORCE,
	MIN_GRAVITY,
	MAX_GRAVITY
} from '@/dice/constants'
import { computed } from 'vue'

const config = defineModel<DiceSceneConfig>({ required: true })

const isDefaultPhysicsConfig = computed(() => {
	return (
		DEFAULT_DICE_SCENE_CONFIG.force === config.value.force &&
		DEFAULT_DICE_SCENE_CONFIG.gravity === config.value.gravity &&
		DEFAULT_DICE_SCENE_CONFIG.scale === config.value.scale &&
		DEFAULT_DICE_SCENE_CONFIG.numberOfDice === config.value.numberOfDice
	)
})

function resetPhysicsConfig() {
	config.value.force = DEFAULT_DICE_SCENE_CONFIG.force
	config.value.gravity = DEFAULT_DICE_SCENE_CONFIG.gravity
	config.value.scale = DEFAULT_DICE_SCENE_CONFIG.scale
	config.value.numberOfDice = DEFAULT_DICE_SCENE_CONFIG.numberOfDice
}
</script>

<template>
	<ion-card>
		<ion-card-header>
			<ion-card-title>{{ $t('roll-dice.config.physics.title') }}</ion-card-title>
		</ion-card-header>
		<ion-card-content>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.numberOfDice = Number(e.detail.value) || DEFAULT_DICE_SCENE_CONFIG.numberOfDice)"
			>
				<ion-range
					:label="$t('roll-dice.config.physics.number')"
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
					:label="$t('roll-dice.config.physics.size')"
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
					:label="$t('roll-dice.config.physics.force')"
					label-placement="stacked"
					:min="MIN_FORCE"
					:max="MAX_FORCE"
					:step="1"
				/>
			</ion-item>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.gravity = Number(e.detail.value) || DEFAULT_DICE_SCENE_CONFIG.gravity)"
			>
				<ion-range
					:value="config.gravity"
					:label="$t('roll-dice.config.physics.gravity')"
					label-placement="stacked"
					:min="MIN_GRAVITY"
					:max="MAX_GRAVITY"
					:step="5"
					snaps
					ticks
				/>
			</ion-item>
		</ion-card-content>
		<ion-button
			:disabled="isDefaultPhysicsConfig"
			class="mb-5 text-center"
			fill="clear"
			expand="block"
			color="danger"
			@click="resetPhysicsConfig"
		>
			{{ $t('roll-dice.config.resetPhysics') }}
		</ion-button>
	</ion-card>
</template>
