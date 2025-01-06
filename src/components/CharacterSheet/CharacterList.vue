<script setup lang="ts">
import { IonModal, IonHeader, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonToolbar, IonIcon, IonLabel } from '@ionic/vue'
import { add, trash, close as closeIcon } from 'ionicons/icons'
import useCharactersStore from '@/store/characterStore'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import AvatarPlaceholderDark from '@/assets/avatar-placeholder-dark.png'
import AvatarPlaceholderLight from '@/assets/avatar-placeholder-light.png'
import useTheme from '@/composables/useTheme'
import { isIos } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isDarkMode } = useTheme()
const { getAllCharacters, setCharacter, removeCharacter, newCharacter } = useCharactersStore()
const { allCharacters, character } = storeToRefs(useCharactersStore())

const isOpen = defineModel<boolean>({
	default: true
})

const placeholder = computed<string>(() => (isDarkMode.value ? AvatarPlaceholderDark : AvatarPlaceholderLight))

watch(isOpen, value => {
	if (value) {
		getAllCharacters()
	}
})

function close() {
	isOpen.value = false
}

function setNewCharacter(id: string) {
	setCharacter(id)
	close()
}

function createNewCharacter() {
	newCharacter()
	close()
}

function remove(id: string) {
	if (
		confirm(
			t('character.remove-message', {
				name: allCharacters.value.find(character => character.id === id)?.name
			})
		)
	) {
		removeCharacter(id)
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
					:color="characterOption.id === character.id ? 'primary' : undefined"
					@click="setNewCharacter(characterOption.id as string)"
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
						@click.stop="remove(characterOption.id as string)"
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
