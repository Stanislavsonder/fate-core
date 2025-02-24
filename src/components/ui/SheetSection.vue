<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>

<template>
	<section
		class="flex flex-col shadow-md rounded-xl bg-background-2 text-primary"
		data-testid="sheet-section"
	>
		<div class="flex justify-between bg-background-3 rounded-t-xl text-light uppercase px-4 py-2 font-bold">
			<h2 class="flex items-center">
				{{ title }}
			</h2>
			<div class="flex ms-auto">
				<slot name="header" />
			</div>
		</div>
		<div class="p-4 py-6">
			<slot />
		</div>
	</section>
</template>
