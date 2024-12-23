<script setup lang="ts">
import SheetSection from '../../ui/SheetSection.vue'
import { Character } from '@/types'
import Consequence from './Consequence.vue'

const character = defineModel<Character>({
	required: true
})
</script>

<template>
	<SheetSection :title="$t('sections.consequences')">
		<ul class="flex flex-col gap-4 p-2">
			<li
				v-for="(consequence, index) in character.consequences"
				:key="index"
			>
				<Consequence :model-value="consequence" />
			</li>
		</ul>
	</SheetSection>
</template>
