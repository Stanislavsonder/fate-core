<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue'
import AdvantageIcon from '@/assets/icons/Advantage.svg'
import PositiveIcon from '@/assets/icons/PositiveDice.svg'
import { settings } from 'ionicons/icons'
</script>

<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<ion-tab-button
					tab="character"
					href="/tabs/character"
				>
					<ion-icon
						aria-hidden="true"
						:src="AdvantageIcon"
					/>
					<ion-label>{{ $t('tabs.character.title') }}</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="roll-dice"
					href="/tabs/roll-dice"
				>
					<ion-icon
						aria-hidden="true"
						:icon="PositiveIcon"
					/>
					<ion-label>{{ $t('tabs.roll-dice.title') }}</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="settings"
					href="/tabs/settings"
				>
					<ion-icon
						aria-hidden="true"
						:icon="settings"
					/>
					<ion-label>{{ $t('tabs.settings.title') }}</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>
