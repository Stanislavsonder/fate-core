<script setup lang="ts">
import { ref } from 'vue'
import type { Character } from '@/types'
import type { Stunt as StuntType } from '../types'
import SheetSection from '@/components/ui/SheetSection.vue'
import Stunt from './parts/Stunt.vue'
import StuntForm from './parts/StuntForm.vue'
import { IonIcon, IonReorderGroup } from '@ionic/vue'
import { addOutline } from 'ionicons/icons'
import ModalWindow from '@/components/ui/ModalWindow.vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

function edit(newStunt: StuntType, index: number) {
	character.value.stunts![index] = newStunt
}

function remove(index: number) {
	character.value.stunts!.splice(index, 1)
}

function addStunt(newStunt: StuntType) {
	character.value.stunts!.push(newStunt)
	isModalOpen.value = false
}

function handleReorder(event: CustomEvent) {
	character.value.stunts = event.detail.complete(character.value.stunts)
}
</script>

<template>
	<SheetSection :title="$t('sonder@core-stunts.label')">
		<template #header>
			<button
				class="inline-flex"
				:aria-label="$t('sonder@core-stunts.addNew')"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="addOutline"
					aria-hidden="true"
				/>
			</button>
		</template>
		<ion-reorder-group
			v-if="character.stunts!.length"
			:disabled="false"
			class="flex flex-col gap-4"
			:aria-label="$t('sonder@core-stunts.list')"
			@ion-item-reorder="handleReorder"
		>
			<Stunt
				v-for="(stunt, index) in character.stunts"
				:key="stunt.name"
				:stunt="stunt"
				@edit="newStunt => edit(newStunt, index)"
				@remove="remove(index)"
			/>
		</ion-reorder-group>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('sonder@core-stunts.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@core-stunts.addNew')"
			sheet
		>
			<StuntForm
				mode="create"
				@save="addStunt"
			/>
		</ModalWindow>
	</SheetSection>
</template>
