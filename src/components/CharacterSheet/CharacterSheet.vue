<template>
	<div
		v-if="charactersStore.isLoaded"
		class="flex flex-col p-2 gap-8"
	>
		<Identity v-model="charactersStore.character" />
		<Tokens v-model="charactersStore.character" />
		<Aspects v-model="charactersStore.character" />
		<Skills v-model="charactersStore.character.skills" />
		<Stunts v-model="charactersStore.character" />
		<Stress v-model="charactersStore.character" />
		<Consequences v-model="charactersStore.character" />
	</div>
	<div
		v-else
		class="grid content-center justify-center rw-full h-full"
	>
		<ion-spinner class="size-30" />
	</div>
</template>

<script setup lang="ts">
import { IonSpinner } from '@ionic/vue'
import Identity from './parts/Identity/Identity.vue'
import Aspects from './parts/Aspects/Aspects.vue'
import Skills from './parts/Skills/Skills.vue'
import Stunts from './parts/Stunts/Stunts.vue'
import Stress from './parts/Stress/Stress.vue'
import Consequences from './parts/Consequences/Consequences.vue'
import Tokens from './parts/Tokens/Tokens.vue'
import useCharactersStore from '@/store/characterStore'
const charactersStore = useCharactersStore()
</script>
