<script setup lang="ts">
import { computed } from 'vue'
import { close, eyedrop } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'

// prettier-ignore
const COLORS_OPTIONS = [
	'#ffc400', // "Gold"
	'#D32F2F', // Red 700
	'#1976D2', // Blue 700
	'#388E3C', // Green 700
	'#7B1FA2', // Purple 700
	'#5D4037', // Brown 700
	'#00796B', // Teal 700
]

const color = defineModel<string | undefined>()
const isManualColor = computed(() => color.value && !COLORS_OPTIONS.includes(color.value))
</script>

<template>
	<ul class="grid grid-flow-col grid-rows-1 gap-1 overflow-x-scroll py-2">
		<li class="grid place-items-center size-10">
			<button
				class="size-8 rounded-full bg-background-2 flex items-center justify-center border-primary bg-background-3 text-light"
				:class="{
					'border-2': color === undefined
				}"
				type="button"
				@click="color = undefined"
			>
				<ion-icon
					:icon="close"
					class="text-2xl"
				/>
			</button>
		</li>
		<li class="grid place-items-center size-10">
			<label
				class="relative size-8 rounded-full flex justify-center items-center bg-background-3 border-primary text-light"
				:class="{
					'border-2': isManualColor
				}"
			>
				<ion-icon
					:icon="eyedrop"
					class="text-lg"
				/>
				<input
					v-model="color"
					class="opacity-0 absolute top-0 w-full h-full"
					type="color"
				/>
			</label>
		</li>
		<li
			v-for="option in COLORS_OPTIONS"
			:key="option"
			class="grid place-items-center size-10"
		>
			<button
				type="button"
				class="size-8 rounded-full border-primary"
				:class="{
					'border-2': color === option
				}"
				:style="{ backgroundColor: option }"
				@click="color = option"
			/>
		</li>
	</ul>
</template>
