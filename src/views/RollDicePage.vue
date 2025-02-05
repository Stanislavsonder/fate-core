<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons } from '@ionic/vue'
import DiceRoll from '@/components/DiceRoll/DiceRoll.vue'
import { options } from 'ionicons/icons'
import DiceRollConfig from '@/components/DiceRoll/DiceRollConfig.vue'
import { ref, watch } from 'vue'
import { DEFAULT_DICE_SCENE_CONFIG, DiceSceneConfig } from '@/composables/useDiceScene.js'
import { clone } from '@/utils/helpers/clone'

const isConfigModalOpen = ref<boolean>(false)
const savedConfig: DiceSceneConfig = localStorage.getItem('dice-roll-config') && JSON.parse(localStorage.getItem('dice-roll-config')!)

const config = ref<DiceSceneConfig>(savedConfig ?? clone(DEFAULT_DICE_SCENE_CONFIG))

watch(
	config,
	() => {
		localStorage.setItem('dice-roll-config', JSON.stringify(config.value))
	},
	{ deep: true }
)

function openConfigMenu() {
	isConfigModalOpen.value = true
}
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="px-4">
					{{ $t('tabs.roll-dice.title') }}
				</ion-title>
				<ion-buttons slot="end">
					<ion-button @click="openConfigMenu">
						<ion-icon
							slot="icon-only"
							:icon="options"
						/>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<DiceRoll v-model="config" />
			<DiceRollConfig
				v-model="config"
				v-model:is-open="isConfigModalOpen"
			/>
		</ion-content>
	</ion-page>
</template>
