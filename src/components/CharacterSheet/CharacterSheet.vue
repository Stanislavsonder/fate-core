<template>
	<div class="flex flex-col p-2 gap-8">
		<Identity v-model="charactersStore.character" />
		<Tokens v-model="charactersStore.character" />
		<Aspects v-model="charactersStore.character" />
		<Skills v-model="charactersStore.character" />
		<Stunts v-model="charactersStore.character" />
		<Stress v-model="charactersStore.character" />
		<Consequences v-model="charactersStore.character" />
	</div>
</template>

<script setup lang="ts">
import Identity from './parts/Identity.vue'
import Aspects from './parts/Aspects.vue'
import Skills from './parts/Skills.vue'
import Stunts from './parts/Stunts.vue'
import Stress from './parts/Stress.vue'
import Consequences from './parts/Consequences.vue'
import Tokens from './parts/Tokens.vue'
import useCharactersStore from '@/store/characterStore'
const charactersStore = useCharactersStore()
</script>
