<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useTheme from '@/composables/useTheme'
import useLanguage from '@/composables/useLanguage'
import useFileHandler from '@/composables/useFileHandler'
import { onMounted } from 'vue'
import { supportsTailwind4, supportsCssLayer } from '@/utils/helpers/browserFeatureCheck'
import { showWarningToast } from '@/utils/helpers/toast'
import { isWeb } from '@/utils/helpers/platform'
import { App as CapApp } from '@capacitor/app'

useTheme()
useLanguage()

const { handleIncomingUrl, handleIncomingFile } = useFileHandler()

onMounted(async () => {
	if (!supportsTailwind4() || !supportsCssLayer()) {
		showWarningToast('errors.outdatedBrowser')
	}

	if (!isWeb) {
		const launchUrl = await CapApp.getLaunchUrl()
		if (launchUrl?.url) {
			handleIncomingUrl(launchUrl.url)
		}
		CapApp.addListener('appUrlOpen', ({ url }) => {
			handleIncomingUrl(url)
		})
	}

	if ('launchQueue' in window) {
		;(window as unknown as { launchQueue: { setConsumer: (cb: (p: { files: FileSystemFileHandle[] }) => void) => void } }).launchQueue.setConsumer(
			async launchParams => {
				for (const fileHandle of launchParams.files ?? []) {
					const file = await fileHandle.getFile()
					handleIncomingFile(file)
				}
			}
		)
	}
})
</script>

<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>
