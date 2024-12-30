<script setup lang="ts">
import ModalWindow from '../../../ui/ModalWindow.vue'
import { ref } from 'vue'
import SkillModal from './SkillModal.vue'

defineProps<{
	name: string
	level: number
}>()

const emit = defineEmits<{
	remove: []
	up: []
	down: []
}>()

const isModalOpen = ref(false)

function up() {
	isModalOpen.value = false
	emit('up')
}

function down() {
	isModalOpen.value = false
	emit('down')
}

function removeSkill() {
	isModalOpen.value = false
	emit('remove')
}
</script>

<template>
	<button
		class="rounded p-2 px-4 text-sm font-bold text-center bg-background-3 text-light"
		@click="isModalOpen = true"
	>
		{{ $t(`skills.${name}.name`) }}
	</button>
		<SkillModal
			v-model="isModalOpen"
			:skill="{ name, level } as { skill }"
			@remove="removeSkill"
			@up="up"
			@down="down"
	/>
</template>
