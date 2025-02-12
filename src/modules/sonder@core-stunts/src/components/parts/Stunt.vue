<script setup lang="ts">
import type { FateContext } from '@/types'
import type { Stunt } from '../../types'
import { IonIcon } from '@ionic/vue'
import StuntForm from './StuntForm.vue'
import { inject, nextTick, type Ref, ref } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

defineProps<{
	stunt: Stunt
}>()

const emit = defineEmits<{
	edit: [newStunt: Stunt]
	remove: []
}>()

const context = inject<Ref<FateContext>>('context')!
const SKILLS = context.value.shared['sonder@core-skills']?.skills || new Map()

const isModalOpen = ref<boolean>(false)

function edit(newStunt: Stunt) {
	isModalOpen.value = false

	nextTick(() => {
		emit('edit', newStunt)
	})
}

function remove() {
	isModalOpen.value = false

	nextTick(() => {
		emit('remove')
	})
}
</script>

<template>
	<button
		:aria-label="$t('sonder@core-stunts.edit')"
		class="border-1 border-primary/25 rounded p-4 text-start"
		@click="isModalOpen = true"
	>
		<span
			class="font-bold text-lg"
			:aria-label="$t('forms.name')"
		>
			{{ stunt.name }}
		</span>
		<br />
		<span
			class="text-sm inline-flex mb-2 italic items-center gap-2"
			:aria-label="$t('forms.skill')"
		>
			<span
				v-if="stunt.priceInTokens"
				class="flex gap-2"
				:aria-label="$t('sonder@core-stunts.price', { value: stunt.priceInTokens })"
			>
				<ion-icon
					v-for="index in stunt.priceInTokens"
					:key="index"
					:icon="context.constants.TOKEN_ICON"
					class="text-lg"
					aria-hidden="true"
				/>
			</span>
			{{ stunt.skillId && $t(SKILLS.get(stunt.skillId)!.name) }}
		</span>
		<br />
		<span
			:aria-label="$t('forms.description')"
			class="text-base text-primary/80"
		>
			{{ stunt.description }}
		</span>
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('sonder@core-stunts.edit')"
		sheet
	>
		<StuntForm
			mode="edit"
			:stunt="stunt"
			@save="edit"
			@remove="remove"
		/>
	</ModalWindow>
</template>
