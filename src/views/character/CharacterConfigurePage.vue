<script setup lang="ts">
import CharacterConfiguration from '@/components/CharacterCreate/CharacterConfiguration.vue'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { Character, CharacterModules } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { isIos } from '@/utils/helpers/platform'
import { ROUTES } from '@/router'
import { onMounted, ref } from 'vue'
import CharacterService from '@/service/character.service'
import useCharacter from '@/store/useCharacter'

const { reconfigureCharacter } = useCharacter()
const router = useRouter()
const { params } = useRoute()

const initialConfig = ref<CharacterModules | undefined>()
const character = ref<Character | undefined>()

onMounted(async () => {
	if (typeof params.id !== 'string') {
		return
	}
	character.value = await CharacterService.getCharacter(params.id)

	if (character.value) {
		initialConfig.value = character.value._modules
	}
})

async function onUpdate(newModules: CharacterModules) {
	if (!Number(params.id)) {
		return
	}
	await reconfigureCharacter(Number(params.id), newModules)
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
				v-if="initialConfig"
				:initial-config
				:initial-name="character?.name"
				@update="onUpdate"
			/>
		</ion-content>
	</ion-page>
</template>
