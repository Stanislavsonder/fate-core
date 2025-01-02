<script setup lang="ts">
import itemIcons from '@/assets/icons/items'
import { IonIcon } from '@ionic/vue'
import { computed } from 'vue'
import { eyedrop, close } from 'ionicons/icons'

const COLORS_OPTIONS = ['#d4af37', '#C30909', '#2828b7', '#5d3b1a', '#05800D', '#9c0eb9']

const isManualColor = computed(() => color.value && !COLORS_OPTIONS.includes(color.value))

const icon = defineModel<string | undefined>({
	default: 'Cube'
})

const color = defineModel<string | undefined>('color', {
	default: undefined
})
</script>

<template>
	<ul class="grid grid-flow-col grid-rows-2 gap-1 h-32 overflow-auto">
		<li
			v-for="option in Object.keys(itemIcons)"
			:key="option"
		>
			<button
				type="button"
				class="size-10 rounded flex items-center justify-center border-primary"
				:class="{
					'border-2': icon === option
				}"
				@click="icon = option"
			>
				<ion-icon
					:icon="itemIcons[option]"
					:style="{ color: color }"
					class="text-3xl"
				/>
			</button>
		</li>
	</ul>
	<div>
		<ul class="flex gap-2 flex-wrap justify-around">
			<li>
				<button
					class="size-8 rounded-full bg-background-2 flex items-center justify-center border-primary bg-background-3 text-secondary"
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
			<li>
				<label
					class="size-8 rounded-full flex justify-center items-center bg-background-3 border-primary text-secondary"
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
						type="color"
						hidden
					/>
				</label>
			</li>
			<li
				v-for="option in COLORS_OPTIONS"
				:key="option"
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
	</div>
</template>
