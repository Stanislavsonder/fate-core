<script setup lang="ts">
import { isIos } from '@/utils/helpers/platform'
import MarkdownIt from 'markdown-it'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import usePolicy from '@/composables/usePolicy'

const { locale } = useI18n()
const { privacyPolicyDate, acceptPolicy } = usePolicy()

const content = ref('')

watch(locale, loadPrivacyPolicy, { immediate: true })

async function loadPrivacyPolicy() {
	const mdParser = new MarkdownIt()
	const raw = await import(`../../../../privacy-policy/languages/${locale.value}.md?raw`)
	content.value = mdParser.render(raw.default)
}
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button
						default-href="/tabs/settings/about"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
				<ion-title class="px-4">{{ $t('settings.about-app.privacy-policy.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<!-- eslint-disable vue/no-v-html -->
			<div
				class="markdown"
				v-html="content"
			/>
			<!-- eslint-enable vue/no-v-html -->
			<p
				v-if="privacyPolicyDate"
				class="p-4"
			>
				{{ $t('settings.about-app.privacy-policy.acceptance-date', { value: new Date(privacyPolicyDate).toLocaleString(locale) }) }}
			</p>
			<ion-button
				v-else
				expand="block"
				class="m-4 mb-8"
				@click="acceptPolicy"
			>
				{{ $t('settings.about-app.privacy-policy.accept-policy') }}
			</ion-button>
		</ion-content>
	</ion-page>
</template>
