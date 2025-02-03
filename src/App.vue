<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useTheme from '@/composables/useTheme'
import useLanguage from '@/composables/useLanguage'

useTheme()
useLanguage()
</script>

<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>
