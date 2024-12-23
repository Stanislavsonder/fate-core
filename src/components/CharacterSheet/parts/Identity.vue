<script setup lang="ts">
import SheetSection from '../../ui/SheetSection.vue'
import { Character } from '@/types'
import { IonInput, IonTextarea } from '@ionic/vue'

const character = defineModel<Character>({
	required: true
})
</script>

<template>
	<SheetSection :title="$t('sections.identity')">
		<div class="flex flex-col gap-4">
			<img
				:src="character.image"
				:alt="character.name"
				class="aspect-square w-full rounded-xl"
			/>
			<div class="flex flex-col gap-2">
				<ion-input
					v-model="character.name"
					class="text-center !text-2xl font-bold"
					:aria-label="$t('identity.name.label')"
					:placeholder="$t('identity.name.placeholder')"
				/>
				<ion-input
					v-model="character.race"
					class="text-center !text-lg text-primary/75"
					:aria-label="$t('identity.race.label')"
					:placeholder="$t('identity.race.placeholder')"
				/>
				<ion-textarea
					v-model="character.description"
					auto-grow
					class="p-2 text-center"
					:aria-label="$t('identity.race.label')"
					:placeholder="$t('identity.description.placeholder')"
				></ion-textarea>
			</div>
		</div>
	</SheetSection>
</template>
