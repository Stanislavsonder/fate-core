<script setup lang="ts">
import { AVAILABLE_LANGUAGES } from '@/i18n'
import flags from '@/assets/icons/flags'
import { LANGUAGES } from '@/i18n/constants'
import { IonIcon, IonItem, IonLabel, IonList, IonRadio } from '@ionic/vue'
import { useI18n } from 'vue-i18n'

defineProps<{
	radio?: boolean
	inset?: boolean
}>()

const { locale } = useI18n()
</script>

<template>
	<ion-list :inset>
		<ion-item
			v-for="language in AVAILABLE_LANGUAGES"
			:key="language"
			:button="true"
			:detail="false"
			@click="locale = language"
		>
			<ion-radio
				v-if="radio"
				slot="start"
				aria-hidden="true"
				tabindex="-1"
				class="pointer-events-none"
				:value="language"
				:checked="language === locale"
			/>
			<ion-icon
				slot="start"
				size="large"
				:icon="flags[language]"
			/>
			<ion-label>
				{{ LANGUAGES[language].nativeName }}
			</ion-label>
		</ion-item>
	</ion-list>
</template>
