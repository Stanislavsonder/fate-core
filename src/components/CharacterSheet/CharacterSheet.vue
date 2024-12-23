<script setup lang="ts">
import Identity from './parts/Identity.vue'
import Aspects from './parts/Aspects.vue'
import Skills from './parts/Skills.vue'
import Stunts from './parts/Stunts.vue'
import Stress from './parts/Stress.vue'
import Consequences from './parts/Consequences.vue'
import Tokens from './parts/Tokens.vue'
import { Character } from '@/types'

const character = defineModel<Character>({
	required: true
})
</script>

<template>
	<div class="flex flex-col p-2 gap-8">
		<Identity v-model="character" />
		<Tokens v-model="character" />
		<Aspects v-model="character" />
		<Skills v-model="character" />
		<Stunts v-model="character" />
		<Stress v-model="character" />
		<Consequences v-model="character" />
	</div>
</template>
