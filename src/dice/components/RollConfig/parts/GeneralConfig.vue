<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToggle } from '@ionic/vue'
import type { DiceSceneConfig } from '@/dice/types'

const config = defineModel<DiceSceneConfig>({ required: true })
</script>

<template>
	<ion-card>
		<ion-card-header>
			<ion-card-title>{{ $t('roll-dice.config.general.title') }}</ion-card-title>
		</ion-card-header>
		<ion-card-content>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.shake = e.detail.checked)"
			>
				<ion-toggle
					:checked="config.shake"
					class="mx-4"
				>
					{{ $t('roll-dice.config.general.shake') }}
				</ion-toggle>
			</ion-item>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.haptic = e.detail.checked)"
			>
				<ion-toggle
					:checked="config.haptic"
					class="mx-4"
				>
					{{ $t('roll-dice.config.general.haptic') }}
				</ion-toggle>
			</ion-item>
			<ion-item
				lines="none"
				@ion-change="(e: CustomEvent) => (config.showResult = e.detail.checked)"
			>
				<ion-toggle
					:checked="config.showResult"
					class="mx-4"
				>
					{{ $t('roll-dice.config.general.show-result') }}
				</ion-toggle>
			</ion-item>
		</ion-card-content>
	</ion-card>
</template>
