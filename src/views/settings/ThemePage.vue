<script setup lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar, IonIcon, IonRadio, IonLabel, IonList } from '@ionic/vue'
import useTheme, { THEMES } from '@/composables/useTheme'
import { isIos } from '@/utils/helpers/platform'

const { theme, setTheme } = useTheme()
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
				<ion-title class="px-4">{{ $t('settings.theme.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-list :inset="true">
				<ion-item
					v-for="themeOption in THEMES"
					:key="themeOption.name"
					button
					:detail="false"
					@click="setTheme(themeOption.name)"
				>
					<ion-radio
						slot="start"
						:checked="themeOption.name === theme"
						class="pointer-events-none"
					/>
					<ion-icon
						slot="start"
						:icon="themeOption.icon"
					/>
					<ion-label>{{ $t(`settings.theme.${themeOption.name}`) }}</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<style>
/* This is added to prevent the flashing that happens when toggling between palettes */
ion-item {
	--transition: none;
}
</style>
