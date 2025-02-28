<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonRange } from '@ionic/vue'
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

const config = defineModel<DiceSceneConfig>({ required: true })
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
	</ion-card>
</template>
