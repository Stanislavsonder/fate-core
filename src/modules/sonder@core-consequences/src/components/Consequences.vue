<script setup lang="ts">
import SheetSection from '@/components/ui/SheetSection.vue'
import type { Character } from '@/types'
import Consequence from './parts/Consequence.vue'
import { settings } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import { ref } from 'vue'
import ConsequencesForm from './parts/ConsequencesForm.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import type { Consequence as ConsequenceType } from '../types'

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
	<SheetSection :title="$t('sonder@core-consequences.label')">
		<template #header>
			<button
				class="flex"
				:aria-label="$t('sonder@core-consequences.edit')"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="settings"
					:aria-hidden="true"
				/>
			</button>
		</template>
		<ul
			v-if="character.consequences.length"
			:aria-label="$t('sonder@core-consequences.list')"
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
			{{ $t('sonder@core-consequences.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@core-consequences.label')"
			sheet
		>
			<ConsequencesForm
				:consequences="character.consequences"
				@save="onChange"
			/>
		</ModalWindow>
	</SheetSection>
</template>
