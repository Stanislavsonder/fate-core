<script setup lang="ts">
import { IonModal, IonHeader, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonToolbar, IonIcon, IonLabel } from '@ionic/vue'
import { add, trash, close as closeIcon } from 'ionicons/icons'
import useCharacter from '@/store/useCharacter'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import AvatarPlaceholderDark from '@/assets/avatar-placeholder-dark.png'
import AvatarPlaceholderLight from '@/assets/avatar-placeholder-light.png'
import useTheme from '@/composables/useTheme'
import { confirmRemove, isIos } from '@/utils'
import { Character } from '@/types'
import CharacterService from '@/service/character.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isDarkMode } = useTheme()
const { loadCharacter, removeCharacter } = useCharacter()
const { character } = storeToRefs(useCharacter())

const isOpen = defineModel<boolean>({
	default: true
})

const placeholder = computed<string>(() => (isDarkMode.value ? AvatarPlaceholderDark : AvatarPlaceholderLight))

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
	if (await confirmRemove(allCharacters.value.find(c => c.id === id)?.name)) {
		await removeCharacter(id)
		allCharacters.value = await CharacterService.getCharacters()
	}
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
				<ion-buttons slot="end">
					<ion-button @click="createNewCharacter">
						<ion-icon
							slot="icon-only"
							:icon="add"
						/>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-list inset>
				<ion-item
					v-for="characterOption in allCharacters"
					:key="characterOption.id"
					:color="characterOption.id === character?.id ? 'primary' : undefined"
					@click="setNewCharacter(characterOption.id)"
				>
					<img
						slot="start"
						aria-hidden="true"
						:alt="characterOption.name"
						class="size-9 rounded-full object-cover"
						:src="characterOption.avatar || placeholder"
					/>
					<ion-label>
						<h2>{{ characterOption.name || $t('character.new-character') }}</h2>
					</ion-label>
					<ion-button
						slot="end"
						fill="clear"
						@click.stop="remove(characterOption.id)"
					>
						<ion-icon
							slot="icon-only"
							color="danger"
							:icon="trash"
						/>
					</ion-button>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-modal>
</template>
