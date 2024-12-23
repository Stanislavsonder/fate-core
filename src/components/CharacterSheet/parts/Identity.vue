<script setup lang="ts">
import SheetSection from "../../ui/SheetSection.vue";
import TextField from "../../ui/TextField.vue";
import { Character } from "@/types";
import { onMounted, ref, watch } from "vue";

const character = defineModel<Character>({
	required: true,
});

const descriptionRef = ref<HTMLTextAreaElement | null>(null);
watch(() => character.value.description, recalculateHeight);
onMounted(recalculateHeight);
function recalculateHeight() {
	if (descriptionRef.value) {
		descriptionRef.value.style.height = "auto";
		descriptionRef.value.style.height = `${descriptionRef.value.scrollHeight}px`;
	}
}
</script>

<template>
	<SheetSection :title="$t('sections.identity')">
		<div class="flex flex-col gap-4">
			<img
				:src="character.image"
				:alt="character.name"
				class="aspect-square w-full rounded-xl"
			/>
			<div class="flex flex-col gap-2">
				<TextField
					class="text-center text-2xl font-bold"
					:label="$t('identity.name.label')"
					v-model="character.name"
					:placeholder="$t('identity.name.placeholder')"
				/>
				<TextField
					class="text-center text-lg text-primary/75"
					:label="$t('identity.race.label')"
					v-model="character.race"
					:placeholder="$t('identity.race.placeholder')"
				/>
				<textarea
					ref="descriptionRef"
					v-model="character.description"
					class="p-2 text-center"
					:aria-label="$t('identity.race.label')"
					:placeholder="$t('identity.description.placeholder')"
				></textarea>
			</div>
		</div>
	</SheetSection>
</template>
