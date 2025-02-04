<script setup lang="ts">
import { IonSpinner, IonButton, IonLabel } from '@ionic/vue'
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
import { ROUTES } from '@/router'

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
				v-model="character"
				class="lg:order-2"
			/>
			<Stunts v-model="character" />
		</div>
		<div class="grid gap-8 lg:grid-cols-2">
			<Stress
				v-if="context.stress.enabled"
				v-model="character"
			/>
			<Consequences v-model="character" />
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
				v-model="character"
				class="lg:col-span-3"
			/>
		</div>
	</div>
	<ion-label
		v-else-if="isLoaded && isReady"
		class="px-8 h-full flex flex-col items-center justify-center text-center"
	>
		<h2>{{ $t('character.not-selected') }}</h2>
		<router-link :to="ROUTES.CHARACTER_CREATE">
			<ion-button fill="clear">
				{{ $t('common.actions.create') }}
			</ion-button>
		</router-link>
	</ion-label>
	<div
		v-else
		class="grid content-center justify-center rw-full h-full"
	>
		<ion-spinner class="size-30" />
	</div>
</template>
