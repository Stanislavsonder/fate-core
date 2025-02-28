<script setup lang="ts">
import type { DiceSceneConfig } from '@/dice/types'
import useDiceScene, { DEFAULT_DICE_SCENE_CONFIG } from '@/dice/composables/useDiceScene'
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dice } from 'ionicons/icons'
import { IonFab, IonFabButton, IonIcon, IonChip } from '@ionic/vue'
import usePermission from '@/composables/usePermission.js'
import { ROUTES } from '@/router'
import RollDebug from './RollDebug.vue'
import { merge } from 'lodash'

const { t } = useI18n()
const { requestMotionPermission } = usePermission()

const config = defineModel<DiceSceneConfig>({ required: true })
watch(
	config,
	newConfig => {
		localStorage.setItem('dice-roll-config', JSON.stringify(newConfig))
		showResult.value = false
	},
	{ deep: true }
)
onMounted(() => {
	const savedConfig = localStorage.getItem('dice-roll-config')
	if (savedConfig) {
		try {
			const parsedConfig = JSON.parse(savedConfig)
			config.value = merge(DEFAULT_DICE_SCENE_CONFIG, parsedConfig, {
				deep: true
			})
		} catch (e) {
			console.error('Failed to parse saved dice config', e)
		}
	}
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { freeze, unfreeze, throwDice, diceResult, isRolling } = useDiceScene(config, canvasRef)
const showResult = ref(isRolling.value !== undefined)

watch(isRolling, () => {
	showResult.value = true
})

const chipColor = computed(() => {
	if (isRolling.value === true) {
		return 'medium'
	}

	return diceResult.value.color
})

async function handleThrow() {
	await requestMotionPermission()
	throwDice()
}

const formattedResult = computed(() => {
	if (isRolling.value) {
		return t('roll-dice.rolling')
	}

	return t('roll-dice.result', {
		value: diceResult.value.text
	})
})

function hideResult() {
	showResult.value = false
}

// Freeze/unfreeze when route changes
const route = useRoute()
watch(route, () => {
	if (route.path === ROUTES.ROLL_DICE) {
		unfreeze()
	} else {
		freeze()
	}
})
</script>

<template>
	<div class="relative w-full h-full overflow-hidden bg-background">
		<RollDebug v-model:config="config" />
		<canvas
			ref="canvasRef"
			class="w-full h-full block"
		/>
		<div
			v-if="diceResult && config.showResult && showResult"
			class="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 rounded-2xl"
			:class="{ 'animate-pulse': isRolling, 'bg-background-2': !isRolling }"
		>
			<ion-chip
				class="text-lg font-bold px-4 py-2"
				:color="chipColor"
				fill="solid"
				@click="hideResult"
			>
				{{ formattedResult }}
			</ion-chip>
		</div>

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
			{{ formattedResult }}
		</p>
	</div>
</template>
