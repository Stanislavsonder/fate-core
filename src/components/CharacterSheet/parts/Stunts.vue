<script setup lang="ts">
import { Character } from '@/types'
import SheetSection from '../../ui/SheetSection.vue'
import Stunt from './Stunt.vue'
import { Stunt as StuntType } from '@/types'
import StuntModal from './StuntModal.vue'
import { ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import { addOutline } from 'ionicons/icons'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

function edit(newStunt: StuntType, index: number) {
	character.value.stunts[index] = newStunt
}

function remove(index: number) {
	character.value.stunts.splice(index, 1)
}

function addStunt(newStunt: StuntType) {
	character.value.stunts.push(newStunt)
	isModalOpen.value = false
}
</script>

<template>
	<SheetSection :title="$t('sections.stunts')">
		<template #header>
			<button
				class="inline-flex"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="addOutline"
				/>
			</button>
		</template>
		<ul class="flex flex-col gap-4">
			<Stunt
				v-for="(stunt, index) in character.stunts"
				:key="stunt.name"
				:stunt="stunt"
				@edit="newStunt => edit(newStunt, index)"
				@remove="remove(index)"
			/>
		</ul>
		<StuntModal
			v-model="isModalOpen"
			mode="create"
			@save="addStunt"
		/>
	</SheetSection>
</template>
