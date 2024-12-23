<script setup lang="ts">
const { titleLevel = 'h2' } = defineProps<{
	title: string
	titleLevel?: string
}>()
</script>

<template>
	<section class="flex flex-col shadow-md rounded-xl bg-secondary">
		<component
			:is="titleLevel"
			class="flex justify-between bg-primary rounded-t-xl text-lg px-4 py-2 text-secondary uppercase font-bold m-0"
		>
			{{ title }}
			<div class="flex ml-auto">
				<slot name="header" />
			</div>
		</component>
		<div class="p-2">
			<slot />
		</div>
	</section>
</template>
