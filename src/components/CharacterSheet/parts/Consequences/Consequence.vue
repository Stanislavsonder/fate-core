<script setup lang="ts">
import { Consequence } from '@/types'
import { CONSEQUENCES_LEVELS } from '@/constants'
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
			class="border-2 border-primary rounded p-2 w-full pl-4"
			type="text"
			:placeholder="$t(`consequences.${consequence.level}.name`)"
			:disabled="consequence.disabled"
		/>
		<span
			class="absolute -top-5 -left-1.5 font-black text-xl scale-150 pointer-events-none"
			:class="{
				'text-stroke-black text-secondary': consequence.disabled,
				'text-stroke-white': !consequence.disabled
			}"
		>
			{{ CONSEQUENCES_LEVELS[consequence.level] }}
		</span>
	</label>
</template>
