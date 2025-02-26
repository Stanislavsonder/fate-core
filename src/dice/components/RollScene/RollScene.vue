<script setup lang="ts">
import type { DiceSceneConfig, DiceResult } from '@/dice/types'
import useDiceScene, { DEFAULT_DICE_SCENE_CONFIG } from '@/dice/composables/useDiceScene'
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dice } from 'ionicons/icons'
import { IonFab, IonFabButton, IonIcon, IonChip } from '@ionic/vue'
import usePermission from '@/composables/usePermission.js'
import { ROUTES } from '@/router'

const { t } = useI18n()
const { requestMotionPermission } = usePermission()

const route = useRoute()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const config = defineModel<DiceSceneConfig>({ required: true })

const { freeze, unfreeze, throwDice, diceResult, isRolling } = useDiceScene(config, canvasRef)

const hasThrown = ref<boolean>(false)
const chipColor = computed(() => {
	if (isRolling.value) {
		return 'medium'
	}

	return rollResult.value.color
})

// Save config changes to localStorage
watch(
	config,
	newConfig => {
		localStorage.setItem('dice-roll-config', JSON.stringify(newConfig))
	},
	{ deep: true }
)

// Load config from localStorage on mount
onMounted(() => {
	const savedConfig = localStorage.getItem('dice-roll-config')
	if (savedConfig) {
		try {
			const parsedConfig = JSON.parse(savedConfig)
			// Use spread to ensure we maintain the correct structure
			config.value = {
				...DEFAULT_DICE_SCENE_CONFIG,
				...parsedConfig,
				// Ensure dice object has proper structure
				dice: {
					...DEFAULT_DICE_SCENE_CONFIG.dice,
					...parsedConfig.dice
				}
			}
		} catch (e) {
			console.error('Failed to parse saved dice config', e)
		}
	}
})

watch(route, () => {
	if (route.path === ROUTES.ROLL_DICE) {
		unfreeze()
	} else {
		freeze()
	}
})

// Watch for changes in the dice result
watch(diceResult, newValue => {
	if (!isRolling.value && hasThrown.value) {
		rollResult.value = newValue
	}
})

const rollResult = ref<DiceResult>({
	value: 0,
	values: [],
	text: '',
	color: 'medium'
})

async function handleThrow() {
	await requestMotionPermission()
	hasThrown.value = true
	throwDice()
	// Initial result will be shown while dice are rolling
	// The final result will be updated when dice stop
}

// Format the result display based on dice type
const formattedResult = computed(() => {
	if (isRolling.value) {
		return t('roll-dice.rolling')
	}

	return t('roll-dice.result', {
		value: rollResult.value.text
	})
})

function hideResult() {
	hasThrown.value = false
}
</script>

<template>
	<div class="relative w-full h-full overflow-hidden bg-background">
		<canvas
			ref="canvasRef"
			class="w-full h-full block"
		/>

		<!-- Visual dice result display -->
		<div
			v-if="hasThrown && config.showResult"
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

		<!-- For screen readers -->
		<p
			aria-live="polite"
			class="sr-only"
		>
			{{ formattedResult }}
		</p>
	</div>
</template>
