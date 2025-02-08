<script setup lang="ts">
import { nextTick, ref } from 'vue'
import SkillForm from './SkillForm.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import useFate from '@/store/useFate'
import type { Skill } from '@/types'
import { storeToRefs } from 'pinia'

const { id } = defineProps<{
	id: string
	level: number
}>()

const emit = defineEmits<{
	remove: []
	update: [level: number]
}>()

const { context } = storeToRefs(useFate())
const isModalOpen = ref(false)

const skill: Skill | undefined = context.value.skills.get(id)

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
		v-if="skill"
		data-testid="open-skill-button"
		class="rounded p-2 px-4 text-sm font-bold text-center bg-background-3 text-light"
		@click="isModalOpen = true"
	>
		{{ $t(skill.name) }}
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t(skill?.name || '')"
		sheet
	>
		<SkillForm
			:id
			:level
			@remove="removeSkill"
			@update="update"
		/>
	</ModalWindow>
</template>
