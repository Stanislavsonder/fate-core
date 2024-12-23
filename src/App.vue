<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

onMounted(() => {
	const savedLocale = localStorage.getItem('locale')
	if (savedLocale) {
		locale.value = savedLocale
	}
})
</script>
