<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useTheme from '@/composables/useTheme'
import useLanguage from '@/composables/useLanguage'
import { onMounted } from 'vue'
import { supportsTailwind4, supportsCssLayer } from '@/utils/helpers/browserFeatureCheck'
import { showWarningToast } from '@/utils/helpers/toast'

useTheme()
useLanguage()

onMounted(() => {
	if (!supportsTailwind4() || !supportsCssLayer()) {
		showWarningToast('errors.outdatedBrowser')
	}
})
</script>

<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>
