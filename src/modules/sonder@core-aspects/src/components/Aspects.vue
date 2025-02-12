<script setup lang="ts">
import type { Character } from '@/types'
import SheetSection from '@/components/ui/SheetSection.vue'
import Aspect from './parts/Aspect.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { ref } from 'vue'
import AspectFrom from './parts/AspectFrom.vue'
import { IonIcon } from '@ionic/vue'
import { add } from 'ionicons/icons'
import type { CharacterAspect } from '../types'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)
function openModal() {
	isModalOpen.value = true
}

function addNewAspect(aspect: CharacterAspect) {
	character.value.aspects?.push(aspect)
	isModalOpen.value = false
}

function remove(index: number) {
	character.value.aspects?.splice(index, 1)
}

function edit(index: number, newAspect: CharacterAspect) {
	character.value.aspects?.splice(index, 1, newAspect)
}
</script>

<template>
	<SheetSection :title="$t('sonder@core-aspects.label')">
		<template #header>
			<button
				data-testid="add-aspect-button"
				class="flex"
				:aria-label="$t('sonder@core-aspects.add')"
				@click="openModal"
			>
				<ion-icon
					aria-hidden="true"
					class="text-2xl"
					:icon="add"
				/>
			</button>
		</template>
		<ul
			v-if="character.aspects?.length"
			class="grid gap-4 lg:grid-cols-2"
			data-testid="aspects-list"
		>
			<Aspect
				v-for="(aspect, index) in character.aspects"
				:key="aspect.name"
				:aspect="aspect"
				@remove="() => remove(index)"
				@edit="newAspect => edit(index, newAspect)"
			/>
		</ul>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('sonder@core-aspects.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@core-aspects.add')"
			sheet
		>
			<AspectFrom @save="addNewAspect" />
		</ModalWindow>
	</SheetSection>
</template>
