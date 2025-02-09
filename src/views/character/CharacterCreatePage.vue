<script setup lang="ts">
import CharacterConfiguration from '@/components/CharacterCreate/CharacterConfiguration.vue'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import type { Character } from '@/types'
import useCharacter from '@/store/useCharacter'
import { useRouter } from 'vue-router'
import { isIos } from '@/utils/helpers/platform'
import { ROUTES } from '@/router'
import { getCoreModulesConfig } from '@/utils/helpers/getCoreModulesConfig'

const { newCharacter } = useCharacter()
const router = useRouter()

const initialConfig = getCoreModulesConfig()

async function onCreate(character: Character) {
	await newCharacter(character)
	router.push(ROUTES.CHARACTER_SHEET)
}
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">{{ $t('tabs.character.title') }}</ion-title>
				<ion-buttons slot="start">
					<ion-back-button
						:default-href="ROUTES.CHARACTER_SHEET"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<CharacterConfiguration
				mode="create"
				:initial-config="initialConfig"
				@create="onCreate"
			/>
		</ion-content>
	</ion-page>
</template>
