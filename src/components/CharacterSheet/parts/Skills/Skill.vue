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
		class="border-1 border-black/20 rounded p-1 px-2 font-bold text-center"
		@click="isModalOpen = true"
	>
		{{ $t(`skills.${name}.name`) }}
	</button>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t(`skills.${name}.name`)"
	>
		<SkillModal
			:skill="{ name, level } as { skill }"
			@remove="removeSkill"
			@up="up"
			@down="down"
	/></ModalWindow>
</template>
