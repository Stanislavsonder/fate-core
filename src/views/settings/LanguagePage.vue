<script setup lang="ts">
import { IonLabel, IonList, IonItem, IonRadio, IonContent, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/vue'
import { AVAILABLE_LANGUAGES } from '@/i18n'
import { LANGUAGES } from '@/i18n/constants'
import { useI18n } from 'vue-i18n'
import { isIos } from '@/utils'
import flags from '@/assets/icons/flags'
const { locale } = useI18n()
</script>
<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button
						default-href="/tabs/settings"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
				<ion-title class="px-4">{{ $t('settings.language') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-list inset>
				<ion-item
					v-for="language in AVAILABLE_LANGUAGES"
					:key="language"
					:button="true"
					:detail="false"
					@click="locale = language"
				>
					<ion-radio
						slot="start"
						aria-hidden="true"
						tabindex="-1"
						class="pointer-events-none"
						:value="language"
						:checked="language === locale"
					/>
					<ion-icon
						slot="start"
						size="large"
						:icon="flags[language]"
					/>
					<ion-label>
						{{ LANGUAGES[language].nativeName }}
					</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>
