<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useTheme from '@/composables/useTheme'
import useLanguage from '@/composables/useLanguage'
import { onMounted } from 'vue'
import { Dialog } from '@capacitor/dialog'
import usePolicy from '@/composables/usePolicy'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

useTheme()
useLanguage()

const router = useRouter()
const { t } = useI18n()
const { isPolicyAccepted } = usePolicy()

onMounted(async () => {
	if (!isPolicyAccepted.value) {
		await Dialog.alert({
			title: t('settings.about-app.privacy-policy.title'),
			message: t('settings.about-app.privacy-policy.not-accepted'),
			buttonTitle: t('common.actions.go')
		})
		router.push('/tabs/settings/about/privacy-policy')
	}
})
</script>

<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>
