<script setup lang="ts">
import { Stunt } from '@/types'
import { IonIcon } from '@ionic/vue'
import StuntForm from './StuntForm.vue'
import { nextTick, ref } from 'vue'
import { TOKEN_ICON } from '@/constants'
import ModalWindow from '@/components/ui/ModalWindow.vue'

defineProps<{
	stunt: Stunt
}>()

const emit = defineEmits<{
	edit: [newStunt: Stunt]
	remove: []
}>()

const isModalOpen = ref<boolean>(false)

function edit(newStunt: Stunt) {
	isModalOpen.value = false
	emit('edit', newStunt)
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
		:aria-label="$t('stunt.edit')"
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
			class="opacity-70 pb-4"
			:aria-label="$t('form.skill')"
		>
			{{ $t(`skills.list.${stunt.skill}.name`) }}
		</span>
		<br />
		<span :aria-label="$t('form.description')">
			{{ stunt.description }}
		</span>
		<span
			v-if="stunt.priceInTokens"
			class="flex mt-4 gap-2"
			:aria-label="$t('stunts.price', { value: stunt.priceInTokens })"
		>
			<ion-icon
				v-for="index in stunt.priceInTokens"
				:key="index"
				:icon="TOKEN_ICON"
				class="text-3xl"
				aria-hidden="true"
			/>
		</span>
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('stunts.edit')"
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
