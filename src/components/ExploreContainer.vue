<template>
	<CharacterSheet v-model="character" />
</template>

<script setup lang="ts">
import CharacterSheet from '@/components/CharacterSheet/CharacterSheet.vue'
import { ref } from 'vue'
import { Character } from '@/types'
import { useI18n } from 'vue-i18n'
import { MOCK_CHARACTERS } from '@/utils'

defineProps({
	name: String
})

const { locale } = useI18n()
const character = ref<Character>(MOCK_CHARACTERS[locale.value])
</script>
