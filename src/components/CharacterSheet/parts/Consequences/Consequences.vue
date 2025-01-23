<script setup lang="ts">
import SheetSection from '../../../ui/SheetSection.vue'
import { Character, Consequence as ConsequenceType } from '@/types'
import Consequence from './Consequence.vue'
import { create } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import { ref } from 'vue'
import ConsequencesForm from '@/components/CharacterSheet/parts/Consequences/ConsequencesForm.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

function onChange(newConsequences: ConsequenceType[]) {
	character.value.consequences = newConsequences
	isModalOpen.value = false
}
</script>

<template>
	<SheetSection :title="$t('sections.consequences')">
		<template #header>
			<button
				class="flex"
				:aria-label="$t('consequences.edit')"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="create"
					:aria-hidden="true"
				/>
			</button>
		</template>
		<ul
			v-if="character.consequences.length"
			:aria-label="$t('consequences.list')"
			class="flex flex-col gap-6 p-2"
		>
			<li
				v-for="(consequence, index) in character.consequences"
				:key="index"
			>
				<Consequence :model-value="consequence" />
			</li>
		</ul>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('consequences.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sections.consequences')"
			sheet
		>
			<ConsequencesForm
				:consequences="character.consequences"
				@save="onChange"
			/>
		</ModalWindow>
	</SheetSection>
</template>
