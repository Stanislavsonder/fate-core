<script setup lang="ts">
import { IonApp, IonRouterOutlet, toastController } from '@ionic/vue'
import useTheme from '@/composables/useTheme'
import useLanguage from '@/composables/useLanguage'
import { onMounted } from 'vue'
import { supportsTailwind4, supportsCssLayer } from '@/utils/helpers/browserFeatureCheck'
import { useI18n } from 'vue-i18n'

useTheme()
useLanguage()

const { t } = useI18n()
onMounted(() => {
	if (!supportsTailwind4() || !supportsCssLayer()) {
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
