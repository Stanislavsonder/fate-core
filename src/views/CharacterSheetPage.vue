<script setup lang="ts">
import { IonPage, IonContent, IonTitle, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/vue'
import CharacterSheet from '@/components/CharacterSheet/CharacterSheet.vue'
import { people } from 'ionicons/icons'
import CharacterList from '@/components/CharacterSheet/CharacterList.vue'
import { ref } from 'vue'

const isOpen = ref<boolean>(false)

function openCharacterList() {
	isOpen.value = true
}
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.character.title') }}</ion-title>
				<ion-buttons slot="end">
					<ion-button @click="openCharacterList">
						<ion-icon
							slot="icon-only"
							:icon="people"
						/>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterSheet class="bg-background" />
			<CharacterList v-model="isOpen" />
		</ion-content>
	</ion-page>
</template>
