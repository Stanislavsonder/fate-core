<script setup lang="ts">
const { size = 'md' } = defineProps<{
	disabled?: boolean
	size?: 'sm' | 'md' | 'lg'
}>()

const sizeClasses = {
	sm: 'text-xs px-2 py-1',
	md: 'text-sm p-2',
	lg: 'text-lg px-6 py-3'
}
</script>

<template>
	<button
		:disabled="disabled"
		class="flex gap-2 justify-center items-center bg-primary text-secondary rounded-md uppercase font-bold text-lg hover:cursor-pointer disabled:opacity-50"
		:class="sizeClasses[size]"
	>
		<slot />
	</button>
</template>
