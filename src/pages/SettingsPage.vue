<template>
	<ion-item class="m-4 rounded">
		<ion-label> {{ $t('language') }}</ion-label>
		<select
			v-model="locale"
			class="emoji-flag"
		>
			<option
				v-for="language in AVAILABLE_LANGUAGES"
				:key="language"
				:value="language"
			>
				{{ LANGUAGES[language].flag }}
				{{ LANGUAGES[language].nativeName }}
			</option>
		</select>
	</ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel } from '@ionic/vue'
import { AVAILABLE_LANGUAGES } from '@/i18n'
import { LANGUAGES } from '@/i18n/constants'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

const { locale } = useI18n()

watch(locale, newLocale => {
	localStorage.setItem('locale', newLocale)
})
</script>
