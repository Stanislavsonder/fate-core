<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const error = ref<unknown>(null)

onErrorCaptured(err => {
	error.value = err
	console.error(err)
	return false
})

function reload() {
	window.location.reload()
}
</script>

<template>
	<div
		v-if="error"
		class="flex flex-col gap-4 justify-center items-center h-full p-6 text-center"
	>
		<p class="text-lg font-bold">{{ t('errors.boundary.title') }}</p>
		<p class="text-sm opacity-75">{{ t('errors.boundary.description') }}</p>
		<Button
			size="md"
			@click="reload"
			>{{ t('errors.boundary.reload') }}</Button
		>
	</div>
	<slot v-else />
</template>
