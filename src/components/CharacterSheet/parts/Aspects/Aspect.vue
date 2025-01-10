<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { CharacterAspect } from '@/types'
import { computed, nextTick, ref } from 'vue'
import { ASPECT_ICONS } from '@/constants'
import AspectFrom from './AspectFrom.vue'
import ModalWindow from '../../../ui/ModalWindow.vue'

const { aspect } = defineProps<{
	aspect: CharacterAspect
}>()

const emit = defineEmits<{
	edit: [newAspect: CharacterAspect]
	remove: []
}>()

const aspectIcon = computed<string | null>(() => ASPECT_ICONS[aspect.type])

const isModalOpen = ref<boolean>(false)

function edit(newAspect: CharacterAspect) {
	isModalOpen.value = false
	nextTick(() => {
		emit('edit', newAspect)
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
		class="rounded p-2 border-1 border-primary/25 text-start bg-secondary text-primary"
		:aria-label="`${$t(`aspects.type.${aspect.type}.name`)} ${$t('aspects.aspect')}`"
		@click="isModalOpen = true"
	>
		<span
			class="text-lg font-bold my-0 mb-5"
			:aria-label="$t('a11y.name')"
		>
			<ion-icon
				v-if="aspectIcon"
				class="float-start mt-0.5 text-2xl me-4"
				:icon="aspectIcon"
				:alt="aspect.name"
				aria-hidden="true"
			/>
			{{ aspect.name }}
		</span>
		<br />
		<span
			class="leading-5 text-primary/80"
			:aria-label="$t('a11y.description')"
		>
			{{ aspect.description }}
		</span>
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('aspects.edit')"
		sheet
	>
		<AspectFrom
			:aspect="aspect"
			mode="edit"
			@save="edit"
			@remove="remove"
		/>
	</ModalWindow>
</template>
