<script setup lang="ts">
import SheetSection from '../../../ui/SheetSection.vue'
import { Character } from '@/types'
import Consequence from './Consequence.vue'
import { create } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import { ref } from 'vue'
import ConsequencesModal from '@/components/CharacterSheet/parts/Consequences/ConsequencesModal.vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)


function onChange(consequences: Character['consequences']) {
	character.value.consequences = consequences
}
</script>

<template>
	<SheetSection :title="$t('sections.consequences')">
		<template #header>
			<button
				class="flex"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="create"
				/>
			</button>
		</template>
		<ul class="flex flex-col gap-4 p-2">
			<li
				v-for="(consequence, index) in character.consequences"
				:key="index"
			>
				<Consequence :model-value="consequence" />
			</li>
		</ul>
		<ConsequencesModal
			v-model="isModalOpen"
			:consequences="character.consequences"
			@save="onChange"
		/>
	</SheetSection>
</template>
