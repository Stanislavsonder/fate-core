<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>

<template>
	<section class="flex flex-col shadow-md rounded-xl bg-background-2 text-primary">
		<div class="flex justify-between bg-background-3 rounded-t-xl text-light uppercase px-4 py-2 font-bold">
			<h2 class="text-lg m-0">
				{{ title }}
			</h2>
			<div class="flex ml-auto rtl:mr-auto rtl:ml-0">
				<slot name="header" />
			</div>
		</div>
		<div class="p-4 py-6">
			<slot />
		</div>
	</section>
</template>
