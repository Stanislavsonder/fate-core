<script setup lang="ts">
import SheetSection from '@/components/ui/SheetSection.vue'
import { IonTextarea } from '@ionic/vue'
import type { Character } from '@/types'

const character = defineModel<Character>({
	required: true
})
</script>

<template>
	<SheetSection :title="$t('sonder@notebook.label')">
		<ion-textarea
			v-model="character.notes"
			mode="ios"
			class="px-1 notebook-textarea"
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
	background-image: repeating-linear-gradient(var(--color-secondary), var(--color-secondary) 16px, var(--line-color) 17px, var(--color-secondary) 18px);
	background-position-y: 10px;
}
</style>
