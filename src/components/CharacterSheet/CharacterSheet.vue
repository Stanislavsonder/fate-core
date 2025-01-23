<script setup lang="ts">
import { IonSpinner } from '@ionic/vue'
import Identity from './parts/Identity/Identity.vue'
import Aspects from './parts/Aspects/Aspects.vue'
import Skills from './parts/Skills/Skills.vue'
import Stunts from './parts/Stunts/Stunts.vue'
import Stress from './parts/Stress/Stress.vue'
import Consequences from './parts/Consequences/Consequences.vue'
import Tokens from './parts/Tokens/Tokens.vue'
import useCharacter from '@/store/useCharacter'
import Inventory from '@/components/CharacterSheet/parts/Inventory/Inventory.vue'
import useFate from '@/store/useFate'
import { storeToRefs } from 'pinia'

const { character, isLoaded } = storeToRefs(useCharacter())
const { isReady, context } = storeToRefs(useFate())
</script>

<template>
	<div
		v-if="isLoaded && character && isReady"
		class="flex flex-col p-2 gap-8"
	>
		<Identity v-model="character" />
		<Aspects v-model="character" />
		<div class="grid gap-8 lg:grid-cols-2">
			<Skills
				v-if="context.skills.enabled"
				v-model="character.skills"
				class="lg:order-2"
			/>
			<Stunts v-model="character" />
		</div>
		<div class="grid gap-8 lg:grid-cols-2">
			<Stress
				v-if="context.stress.enabled"
				v-model="character"
			/>
			<Consequences v-model="character.consequences" />
		</div>
		<Tokens
			v-model="character"
			class="lg:hidden"
		/>
		<div class="grid gap-8 lg:grid-cols-4">
			<Tokens
				v-model="character"
				class="hidden lg:block"
			/>
			<Inventory
				v-model="character.inventory"
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
