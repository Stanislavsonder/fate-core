<script setup lang="ts">
import { nextTick, ref } from 'vue'
import SkillForm from './SkillForm.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

defineProps<{
	name: string
	level: number
}>()

const emit = defineEmits<{
	remove: []
	update: [level: number]
}>()

const isModalOpen = ref(false)

function removeSkill() {
	isModalOpen.value = false
	nextTick(() => {
		emit('remove')
	})
}

function update(level: number) {
	isModalOpen.value = false
	nextTick(() => {
		emit('update', level)
	})
}
</script>

<template>
	<button
		class="rounded p-2 px-4 text-sm font-bold text-center bg-background-3 text-light"
		@click="isModalOpen = true"
	>
		{{ $t(`skills.list.${name}.name`) }}
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="`${$t(`skills.list.${name}.name`)}`"
		sheet
	>
		<SkillForm
			:skill="{ name, level } as { skill }"
			@remove="removeSkill"
			@update="update"
		/>
	</ModalWindow>
</template>
