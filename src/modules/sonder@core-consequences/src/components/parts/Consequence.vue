<script setup lang="ts">
import { IonTextarea } from '@ionic/vue'
import type { Consequence } from '../../types'
import { inject, type Ref } from 'vue'
import type { FateContext } from '@/types'

const context = inject<Ref<FateContext>>('context')!

const consequence = defineModel<Consequence>({
	required: true
})
</script>

<template>
	<label
		:aria-label="
			consequence.disabled
				? $t(`sonder@core-consequences.lockedType`, { value: consequence.level })
				: $t(`sonder@core-consequences.unlockedType`, { value: consequence.level })
		"
		class="relative block border-2 border-primary rounded w-full ps-4"
		:class="{
			'opacity-30': consequence.disabled
		}"
	>
		<ion-textarea
			v-model="consequence.description"
			:debounce="1000"
			:aria-label="$t('a11y.description')"
			auto-grow
			enterkeyhint="done"
			inputmode="text"
			:rows="1"
			:placeholder="$t(`sonder@core-consequences.type.${consequence.level}.name`)"
			:disabled="consequence.disabled"
		/>
		<span
			class="absolute -top-5 -start-1.5 font-black text-xl scale-150 pointer-events-none"
			:class="{
				'text-stroke-black text-secondary': consequence.disabled,
				'text-stroke-white': !consequence.disabled
			}"
			:aria-label="$t(`sonder@core-consequences.stressLevel`)"
		>
			{{ context.constants.CONSEQUENCES_LEVELS![consequence.level] }}
		</span>
	</label>
</template>
