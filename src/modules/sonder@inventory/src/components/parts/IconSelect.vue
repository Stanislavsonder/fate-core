<script setup lang="ts">
import icons from '../../assets/icons'
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
			v-for="name in Object.keys(icons)"
			:key="name"
		>
			<button
				type="button"
				class="size-10 rounded flex items-center justify-center border-primary"
				:class="{
					'border-2': icon === name
				}"
				@click="icon = name"
			>
				<ion-icon
					:icon="icons[name]"
					:style="{ color }"
					class="text-3xl transition-colors"
				/>
			</button>
		</li>
	</ul>
</template>
