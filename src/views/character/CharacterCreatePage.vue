<script setup lang="ts">
import CharacterCreateForm from '@/components/CharacterCreate/CharacterCreateForm.vue'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { Character } from '@/types'
import useCharacter from '@/store/useCharacter'
import { useRouter } from 'vue-router'
import { isIos } from '@/utils'

const { newCharacter } = useCharacter()
const router = useRouter()

async function onCreate(character: Character) {
	await newCharacter(character)
	router.push('/tabs/character')
}
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.character.title') }}</ion-title>
				<ion-buttons slot="start">
					<ion-back-button
						default-href="/tabs/character"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterCreateForm @create="onCreate" />
		</ion-content>
	</ion-page>
</template>
