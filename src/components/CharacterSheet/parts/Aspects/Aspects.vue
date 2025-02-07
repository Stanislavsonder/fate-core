<script setup lang="ts">
import { Character, CharacterAspect } from '@/types'
import SheetSection from '../../../ui/SheetSection.vue'
import Aspect from './Aspect.vue'
import ModalWindow from '../../../ui/ModalWindow.vue'
import { ref } from 'vue'
import AspectFrom from './AspectFrom.vue'
import { IonIcon } from '@ionic/vue'
import { add } from 'ionicons/icons'

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
			<button
				data-testid="add-aspect-button"
				class="flex"
				:aria-label="$t('aspects.add-new')"
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
			v-if="character.aspects.length"
			class="grid gap-4 lg:grid-cols-2"
			data-testid="aspects-list"
		>
			<Aspect
				v-for="(aspect, index) in character.aspects"
				:key="aspect.name"
				:aspect="aspect"
				@remove="() => remove(index)"
				@edit="newAspect => (character.aspects[index] = newAspect)"
			/>
		</ul>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('aspects.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('aspects.add-new')"
			sheet
		>
			<AspectFrom @save="addNewAspect" />
		</ModalWindow>
	</SheetSection>
</template>
