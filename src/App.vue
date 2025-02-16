<script setup lang="ts">
import { IonApp, IonRouterOutlet, toastController } from '@ionic/vue'
import useTheme from '@/composables/useTheme'
import useLanguage from '@/composables/useLanguage'
import { onMounted } from 'vue'
import { supportsCssLayer } from '@/utils/helpers/supportsCssLayer'
import { useI18n } from 'vue-i18n'

useTheme()
useLanguage()

const { t } = useI18n()
onMounted(() => {
	if (!supportsCssLayer()) {
		toastController
			.create({
				message: t('errors.outdatedBrowser'),
				duration: 5000,
				color: 'warning'
			})
			.then(toast => toast.present())
	}
})
</script>

<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>
