<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import type { CharacterAspect } from '../../types'
import { computed, inject, nextTick, type Ref, ref } from 'vue'
import AspectFrom from './AspectFrom.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import type { FateContext } from '@/types'

const { aspect } = defineProps<{
	aspect: CharacterAspect
}>()

const emit = defineEmits<{
	edit: [newAspect: CharacterAspect]
	remove: []
}>()

const context = inject<Ref<FateContext>>('context')!

const aspectIcon = computed<string | undefined>(() => context.value.constants.ASPECT_ICONS[aspect.type])

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
		data-testid="edit-aspect-button"
		class="rounded p-2 border-1 border-primary/25 text-start bg-secondary text-primary"
		:aria-label="`${$t(`sonder@core-aspects.type.${aspect.type}.name`)} ${$t('sonder@core-aspects.aspect')}`"
		@click="isModalOpen = true"
	>
		<span
			class="text-lg font-bold"
			:aria-label="$t('a11y.name')"
		>
			<ion-icon
				v-if="aspectIcon"
				class="float-start text-2xl me-2"
				:icon="aspectIcon"
				:alt="aspect.name"
				aria-hidden="true"
			/>
			{{ aspect.name }}
		</span>
		<br />
		<br />
		<span
			class="text-primary/80 text-base"
			:aria-label="$t('a11y.description')"
		>
			{{ aspect.description }}
		</span>
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('sonder@core-aspects.edit')"
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
