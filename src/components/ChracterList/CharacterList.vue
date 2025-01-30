<script setup lang="ts">
import { IonModal, IonHeader, IonButtons, IonButton, IonTitle, IonContent, IonToolbar, IonIcon } from '@ionic/vue'
import { add, bugOutline, close as closeIcon, document as documentIcon } from 'ionicons/icons'
import useCharacter from '@/store/useCharacter'
import { ref, watch } from 'vue'
import { isIos } from '@/utils/helpers/platform'
import { Character } from '@/types'
import CharacterService from '@/service/character.service'
import { useRouter } from 'vue-router'
import CharacterCard from '@/components/ChracterList/parts/CharacterCard.vue'
import mockCharacters from '@/utils/mock/characters'
import useDebug from '@/composables/useDebug'

const router = useRouter()
const { loadCharacter, removeCharacter, newCharacter } = useCharacter()
const { isDebug } = useDebug()

const isOpen = defineModel<boolean>({
	default: true
})
const allCharacters = ref<Character[]>([])

watch(isOpen, async value => {
	if (value) {
		allCharacters.value = await CharacterService.getCharacters()
	}
})

function close() {
	isOpen.value = false
}

function setNewCharacter(id: number) {
	loadCharacter(id)
	close()
}

function createNewCharacter() {
	close()
	router.push('/tabs/character/create')
}

async function remove(id: number) {
	await removeCharacter(id)
	allCharacters.value = await CharacterService.getCharacters()
}

function addMock() {
	const randomMockCharacter = mockCharacters[Math.floor(Math.random() * mockCharacters.length)]
	newCharacter(randomMockCharacter)
	close()
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
</script>

<template>
	<ion-modal
		v-model:is-open="isOpen"
		@will-dismiss="close"
	>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						v-if="isIos"
						@click="close"
					>
						{{ $t('common.actions.close') }}
					</ion-button>
					<ion-button
						v-else
						@click="close"
					>
						<ion-icon :icon="closeIcon" />
					</ion-button>
				</ion-buttons>
				<ion-title>{{ $t('character.your-characters') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterCard
				v-for="char in allCharacters"
				:key="char.id"
				:character="char"
				@select="setNewCharacter"
				@remove="remove"
			/>
			<ion-label
				v-if="!allCharacters?.length"
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
		</ion-content>
	</ion-modal>
</template>
