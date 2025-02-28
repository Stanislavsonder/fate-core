<script setup lang="ts">
import { computed } from 'vue'
import { IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/vue'
import { DICE_SHAPES, DICE_MATERIALS } from '@/dice/constants'
import type { DiceSceneConfig } from '@/dice/types'

const config = defineModel<DiceSceneConfig>({ required: true })
const diceTypes = computed(() => Array.from(DICE_SHAPES.values()).map(shape => ({ value: shape.name, icon: shape.icon })))
const diceMaterials = computed(() => Array.from(DICE_MATERIALS.values()).map(material => ({ value: material.name, color: material.previewColor })))
</script>

<template>
	<ion-card>
		<ion-card-header>
			<ion-card-title>{{ $t('roll-dice.config.dice.title') }}</ion-card-title>
		</ion-card-header>
		<ion-card-content>
			<!-- Dice Type Selection -->
			<div class="option-section">
				<div class="option-label">{{ $t('roll-dice.config.dice.type') }}</div>
				<ul class="flex flex-wrap gap-2">
					<li
						v-for="type in diceTypes"
						:key="type.value"
					>
						<button
							class="flex items-center gap-2 flex-col"
							@click="config.dice.shape = type.value"
						>
							<ion-icon
								:icon="type.icon"
								class="text-5xl"
								:class="{ 'text-accent': config.dice.shape === type.value }"
							/>
							<ion-label>{{ type.value }}</ion-label>
						</button>
					</li>
				</ul>
			</div>

			<!-- Dice Material Selection -->
			<div class="option-section">
				<div class="option-label">{{ $t('roll-dice.config.dice.material') }}</div>
				<ul class="flex flex-wrap gap-2">
					<li
						v-for="material in diceMaterials"
						:key="material.value"
					>
						<button
							:style="{ backgroundColor: material.color }"
							:class="{ 'border-2 !border-accent shadow-sm shadow-accent': config.dice.material === material.value }"
							class="w-10 h-10 rounded-full border-1 border-gray-300"
							@click="config.dice.material = material.value"
						/>
					</li>
				</ul>
			</div>
		</ion-card-content>
	</ion-card>
</template>

<style scoped>
.option-section {
	margin-bottom: 20px;
}

.option-label {
	font-weight: bold;
	margin-bottom: 8px;
}
</style>
