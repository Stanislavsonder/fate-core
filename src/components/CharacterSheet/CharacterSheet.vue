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
import Inventory from '@/components/CharacterSheet/parts/Inventory/Inventory.vue'
const charactersStore = useCharactersStore()
</script>

<template>
	<div
		v-if="charactersStore.isLoaded"
		class="flex flex-col p-2 gap-8"
	>
		<Identity v-model="charactersStore.character" />
		<Aspects v-model="charactersStore.character" />
		<div class="grid gap-8 lg:grid-cols-2">
			<Skills
				v-model="charactersStore.character.skills"
				class="lg:order-2"
			/>
			<Stunts v-model="charactersStore.character" />
		</div>
		<div class="grid gap-8 lg:grid-cols-2">
			<Stress v-model="charactersStore.character" />
			<Consequences v-model="charactersStore.character" />
		</div>
		<Tokens
			v-model="charactersStore.character"
			class="lg:hidden"
		/>
		<div class="grid gap-8 lg:grid-cols-4">
			<Tokens
				v-model="charactersStore.character"
				class="hidden lg:block"
			/><Inventory
				v-model="charactersStore.character.inventory"
				class="lg:col-span-3"
			/>
		</div>
	</div>
	<div
		v-else
		class="grid content-center justify-center rw-full h-full"
	>
		<ion-spinner class="size-30" />
	</div>
</template>
