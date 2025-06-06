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
import { clone } from '@/utils/helpers/clone'
const { t } = useI18n()
const { requestMotionPermission } = usePermission()

const config = defineModel<DiceSceneConfig>({ required: true })
watch(
	config,
	newConfig => {
		localStorage.setItem('dice-roll-config', JSON.stringify(newConfig))
	},
	{ deep: true }
)
onMounted(() => {
	const savedConfig = localStorage.getItem('dice-roll-config')
	if (savedConfig) {
		try {
			const parsedConfig = JSON.parse(savedConfig)
			config.value = merge(clone(DEFAULT_DICE_SCENE_CONFIG), parsedConfig, {
				deep: true
			})
		} catch (e) {
			console.error('Failed to parse saved dice config', e)
		}
	}
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { freeze, unfreeze, throwDice, diceResult, isRolling } = useDiceScene(config, canvasRef)
const resultVisible = ref(true)

watch(isRolling, () => {
	resultVisible.value = true
})

const showResult = computed(() => {
	return diceResult.value && config.value.showResult && formattedResult.value
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

	if (!diceResult.value.text) {
		return ''
	}

	return t('roll-dice.result', {
		value: diceResult.value.text
	})
})

function toggleResultVisibility() {
	resultVisible.value = !resultVisible.value
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
			v-if="showResult"
			class="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 rounded-2xl transition-opacity duration-150"
			:class="{
				'animate-pulse': isRolling,
				'bg-background-2': !isRolling,
				'opacity-25': !resultVisible
			}"
		>
			<ion-chip
				class="text-lg font-bold px-4 py-2"
				:color="chipColor"
				fill="solid"
				@click="toggleResultVisibility"
			>
				{{ formattedResult }}
			</ion-chip>
		</div>

		<ion-fab
			slot="fixed"
			vertical="bottom"
			horizontal="center"
			class="transition-opacity duration-150"
			:class="{ 'opacity-25': !resultVisible }"
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
