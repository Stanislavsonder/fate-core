<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button default-href="/tabs/settings" :text="isIos ? $t('tabs.settings.title') : undefined"/>
				</ion-buttons>
				<ion-title class="px-4">{{ $t('settings.language') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content >
			<ion-list inset>
				<ion-item v-for="language in AVAILABLE_LANGUAGES" :key="language" :button="true" :detail="false" @click="locale = language">
					<ion-radio
						slot="start"
						aria-hidden="true"
						tabindex="-1"
						class="mr-2 pointer-events-none"
						:value="language"
						:checked="language === locale"/>
					<ion-avatar slot="end" class="emoji-flag text-2xl flex items-center">
						{{ LANGUAGES[language].flag }}
					</ion-avatar>
					<ion-label>
						{{ 	LANGUAGES[language].nativeName }}
					</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonLabel,
	IonList,
	IonItem,
	IonRadio,
	IonContent,
	IonAvatar,
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonBackButton, IonButtons
} from '@ionic/vue'
import { AVAILABLE_LANGUAGES } from '@/i18n'
import { LANGUAGES } from '@/i18n/constants'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { isIos } from '@/utils'

const { locale } = useI18n()

watch(locale, newLocale => {
	localStorage.setItem('locale', newLocale)
})
</script>
