<script setup lang="ts">
import { useRouter } from 'vue-router'
import usePolicy from '@/composables/usePolicy'
import { ref, watch } from 'vue'
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import { ROUTES } from '@/router'

const { isPolicyAccepted, acceptPolicy } = usePolicy()
const router = useRouter()
const { locale } = useI18n()

const content = ref('')

watch(locale, loadPrivacyPolicy, { immediate: true })

async function loadPrivacyPolicy() {
	if (isPolicyAccepted.value) {
		goToCharacterPage()
		return
	}
	const mdParser = new MarkdownIt()
	const raw = await import(`../../privacy-policy/languages/${locale.value}.md?raw`)
	content.value = mdParser.render(raw.default)
}

function goToCharacterPage() {
	router.push(ROUTES.CHARACTER_SHEET)
}

function acceptPolicyHandler() {
	acceptPolicy()
	goToCharacterPage()
}
</script>

<template>
	<ion-page>
		<ion-header v-if="content">
			<ion-toolbar>
				<ion-title class="px-4">
					{{ $t('settings.about-app.privacy-policy.title') }}
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content v-if="content">
			<!-- eslint-disable vue/no-v-html -->
			<div
				class="markdown"
				v-html="content"
			/>
			<!-- eslint-enable vue/no-v-html -->
			<ion-button
				expand="block"
				class="m-4 mb-8"
				@click="acceptPolicyHandler"
			>
				{{ $t('settings.about-app.privacy-policy.accept-policy') }}
			</ion-button>
		</ion-content>
	</ion-page>
</template>
