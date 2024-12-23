<script setup lang="ts">
import { Character, CharacterAspect } from '@/types'
import SheetSection from '../../ui/SheetSection.vue'
import Aspect from './Aspect.vue'
import ModalWindow from '../../ui/ModalWindow.vue'
import { ref } from 'vue'
import AspectFrom from './AspectFrom.vue'
import { IonIcon } from '@ionic/vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)
function openModal() {
	isModalOpen.value = true
}

function addNewAspect(aspect: CharacterAspect) {
	character.value.aspects.push(aspect)
	isModalOpen.value = false
}

function remove(index: number) {
	character.value.aspects.splice(index, 1)
}
</script>

<template>
	<SheetSection :title="$t('sections.aspects')">
		<template #header>
			<button @click="openModal">
				<ion-icon name="add-outline"></ion-icon>
			</button>
		</template>
		<div
			class="flex flex-col gap-4"
			v-if="character.aspects.length"
		>
			<Aspect
				:aspect="aspect"
				v-for="(aspect, index) in character.aspects"
				:key="aspect.name"
				@remove="() => remove(index)"
				@edit="newAspect => (character.aspects[index] = newAspect)"
			/>
		</div>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('aspects.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('aspects.add-new')"
		>
			<AspectFrom @save="addNewAspect" />
		</ModalWindow>
	</SheetSection>
</template>
