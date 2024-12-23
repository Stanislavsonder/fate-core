<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>

<template>
	<section class="flex flex-col shadow-md rounded-xl bg-secondary text-primary">
		<div class="flex justify-between bg-primary rounded-t-xl text-secondary uppercase px-4 py-2 font-bold">
			<h2 class="text-lg m-0">
				{{ title }}
			</h2>
			<div class="flex ml-auto">
				<slot name="header" />
			</div>
		</div>
		<div class="p-2">
			<slot />
		</div>
	</section>
</template>
