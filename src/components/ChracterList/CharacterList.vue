<script setup lang="ts">
import { IonIcon, IonFab, IonFabList, IonFabButton, IonLabel } from '@ionic/vue'
import { add, bugOutline, document as documentIcon } from 'ionicons/icons'
import useCharacter from '@/store/useCharacter'
import { ref } from 'vue'
import type { Character } from '@/types'
import CharacterService from '@/service/character.service'
import { useRouter } from 'vue-router'
import CharacterCard from '@/components/ChracterList/parts/CharacterCard.vue'
import mockCharacters from '@/utils/mock/characters'
import useDebug from '@/composables/useDebug'
import { ROUTES } from '@/router'

defineExpose({ refresh })

const router = useRouter()
const { loadCharacter, removeCharacter, newCharacter } = useCharacter()
const { isDebug } = useDebug()

const allCharacters = ref<Character[]>([])

async function refresh() {
	allCharacters.value = await CharacterService.getCharacters()
}

function setNewCharacter(id: number) {
	loadCharacter(id)
	router.push(ROUTES.CHARACTER_SHEET)
}

function createNewCharacter() {
	router.push(ROUTES.CHARACTER_CREATE)
}

async function remove(id: number) {
	await removeCharacter(id)
	allCharacters.value = await CharacterService.getCharacters()
}

function addMock() {
	const randomMockCharacter = mockCharacters[Math.floor(Math.random() * mockCharacters.length)]
	newCharacter(randomMockCharacter as Character)
	router.push(ROUTES.CHARACTER_SHEET)
}

async function importCharacter() {
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = CharacterService.CHARACTER_EXTENSION
	input.onchange = async (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			const character = await CharacterService.importCharacter(file)
			await newCharacter(character)
			allCharacters.value = await CharacterService.getCharacters()
		}
	}
	input.click()
}

function configure(id: number) {
	router.push(ROUTES.CHARACTER_CONFIGURE.replace(':id', id.toString()))
}
</script>

<template>
	<div
		v-if="allCharacters?.length"
		class="grid md:grid-cols-2 gap-8 p-4"
	>
		<CharacterCard
			v-for="char in allCharacters"
			:key="char.id"
			:character="char"
			@select="setNewCharacter"
			@remove="remove"
			@configure="configure"
		/>
	</div>
	<ion-label
		v-else
		class="text-center h-full grid items-center px-6"
	>
		<h2>
			{{ $t('character.no-characters') }}
		</h2>
	</ion-label>
	<ion-fab
		slot="fixed"
		vertical="bottom"
		horizontal="end"
	>
		<ion-fab-button :aria-label="$t('character.create')">
			<ion-icon
				:icon="add"
				aria-hidden="true"
			/>
		</ion-fab-button>
		<ion-fab-list side="top">
			<ion-fab-button
				:aria-label="$t('character.create')"
				@click="createNewCharacter"
			>
				<ion-icon
					:icon="add"
					aria-hidden="true"
				/>
			</ion-fab-button>
			<ion-fab-button
				:aria-label="$t('character.import')"
				@click="importCharacter"
			>
				<ion-icon
					:icon="documentIcon"
					aria-hidden="true"
				/>
			</ion-fab-button>
			<ion-fab-button
				v-if="isDebug"
				:aria-label="$t('debug.add-mock-character')"
				@click="addMock"
			>
				<ion-icon
					:icon="bugOutline"
					aria-hidden="true"
				/>
			</ion-fab-button>
		</ion-fab-list>
	</ion-fab>
</template>
