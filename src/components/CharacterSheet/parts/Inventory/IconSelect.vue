<script setup lang="ts">
import itemIcons from '@/assets/icons/items'
import { IonIcon } from '@ionic/vue'

defineProps<{
	color?: string
}>()

const icon = defineModel<string | undefined>({
	default: 'Cube'
})
</script>

<template>
	<ul class="grid grid-flow-col grid-rows-3 gap-1 overflow-x-scroll py-2">
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
					:style="{ color }"
					class="text-3xl transition-colors"
				/>
			</button>
		</li>
	</ul>
</template>
