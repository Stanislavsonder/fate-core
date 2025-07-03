<script setup lang="ts">
import SheetSection from '@/components/ui/SheetSection.vue'
import { IonTextarea } from '@ionic/vue'
import type { Character } from '@/types'

const character = defineModel<Character>({
	required: true
})

const fontSize = '18px'
</script>

<template>
	<SheetSection :title="$t('sonder@notebook.label')">
		<ion-textarea
			v-model="character.notes"
			mode="ios"
			class="notebook-textarea"
			auto-grow
		/>
	</SheetSection>
</template>

<style scoped>
:root.ion-palette-dark .notebook-textarea {
	--line-color: #333;
}

.notebook-textarea {
	--line-color: #dadada;
	--line-height: v-bind(fontSize);
	font-size: var(--line-height);
	background-image: repeating-linear-gradient(
		to top,
		transparent,
		transparent calc(var(--line-height) - 1px),
		var(--line-color) calc(var(--line-height) - 1px),
		var(--line-color) var(--line-height)
	);
	background-size: 100% var(--line-height);
	background-position-y: calc(var(--line-height) / 2);

	:global(.native-textarea) {
		line-height: var(--line-height);
	}
}
</style>
