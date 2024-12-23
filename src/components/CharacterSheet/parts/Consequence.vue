<script setup lang="ts">
import { Consequence } from '@/types'
const consequence = defineModel<Consequence>({
	required: true
})
</script>

<template>
	<label
		class="relative"
		:class="{
			'opacity-30': consequence.disabled
		}"
	>
		<input
			class="border-2 border-primary rounded p-2 w-full"
			type="text"
			:placeholder="$t(`consequences.${consequence.level}.name`)"
			:disabled="consequence.disabled"
		/>
		<span
			class="absolute -top-5 -left-1.5 font-black text-xl scale-150 pointer-events-none"
			:class="{
				'text-stroke-3 text-secondary': consequence.disabled
			}"
		>
			{{ consequence.count }}
		</span>
	</label>
</template>
