<script setup lang="ts">
import { IonModal, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonList, IonItem, IonRange } from '@ionic/vue'
import {
	DEFAULT_DICE_SCENE_CONFIG,
	DiceSceneConfig,
	MAX_DICE_COUNT,
	MAX_FORCE,
	MAX_GRAVITY,
	MAX_SCALE,
	MIN_DICE_COUNT,
	MIN_FORCE,
	MIN_GRAVITY,
	MIN_SCALE
} from '@/composables/useDiceScene.js'
import { computed } from 'vue'

const isOpen = defineModel<boolean>('isOpen', {
	default: false
})

const isDefaultConfig = computed(() => {
	return (
		config.value.diceCount === DEFAULT_DICE_SCENE_CONFIG.diceCount &&
		config.value.force === DEFAULT_DICE_SCENE_CONFIG.force &&
		config.value.scale === DEFAULT_DICE_SCENE_CONFIG.scale &&
		config.value.gravity === DEFAULT_DICE_SCENE_CONFIG.gravity
	)
})

const config = defineModel<DiceSceneConfig>({
	required: true
})

const dismiss = () => {
	isOpen.value = false
}

function update(key: keyof DiceSceneConfig, value: number) {
	if (key === 'dice') {
		return
	}
	config.value[key] = value
}

function reset() {
	config.value.diceCount = DEFAULT_DICE_SCENE_CONFIG.diceCount
	config.value.force = DEFAULT_DICE_SCENE_CONFIG.force
	config.value.scale = DEFAULT_DICE_SCENE_CONFIG.scale
	config.value.gravity = DEFAULT_DICE_SCENE_CONFIG.gravity
	localStorage.removeItem('dice-roll-config')
}
</script>

<template>
	<ion-modal
		v-model:is-open="isOpen"
		@will-dismiss="dismiss"
	>
		<ion-content>
			<ion-toolbar>
				<ion-title>{{ $t('roll-dice.config.title') }}</ion-title>
				<ion-buttons slot="end">
					<ion-button @click="dismiss">{{ $t('common.actions.close') }}</ion-button>
				</ion-buttons>
			</ion-toolbar>
			<ion-list>
				<ion-item>
					<ion-range
						:label="$t('roll-dice.config.count')"
						label-placement="stacked"
						:value="config.diceCount"
						:min="MIN_DICE_COUNT"
						:max="MAX_DICE_COUNT"
						:step="1"
						snaps
						pin
						ticks
						@ion-change="e => update('diceCount', e.detail.value as number)"
					/>
				</ion-item>
				<ion-item>
					<ion-range
						:value="config.force"
						:label="$t('roll-dice.config.force')"
						label-placement="stacked"
						:min="MIN_FORCE"
						:max="MAX_FORCE"
						:step="1"
						@ion-change="e => update('force', e.detail.value as number)"
					/>
				</ion-item>
				<ion-item>
					<ion-range
						:value="config.scale"
						:label="$t('roll-dice.config.size')"
						label-placement="stacked"
						:min="MIN_SCALE"
						:max="MAX_SCALE"
						:step="2"
						snaps
						ticks
						@ion-change="e => update('scale', e.detail.value as number)"
					/>
				</ion-item>
				<ion-item>
					<ion-range
						:value="config.gravity"
						:label="$t('roll-dice.config.gravity')"
						label-placement="stacked"
						:min="MIN_GRAVITY"
						:max="MAX_GRAVITY"
						:step="5"
						snaps
						ticks
						@ion-change="e => update('gravity', e.detail.value as number)"
					/>
				</ion-item>
			</ion-list>
			<ion-button
				:disabled="isDefaultConfig"
				class="mt-5"
				fill="clear"
				expand="full"
				color="danger"
				@click="reset"
			>
				{{ $t('roll-dice.config.reset') }}
			</ion-button>
		</ion-content>
	</ion-modal>
</template>
