<script setup lang="ts">
import SheetSection from '../../../ui/SheetSection.vue'
import { Character } from '@/types'
import { IonTextarea } from '@ionic/vue'
import Avatar from '@/components/CharacterSheet/parts/Identity/Avatar.vue'

const character = defineModel<Character>({
	required: true
})
</script>

<template>
	<SheetSection :title="$t('sections.identity')">
		<div class="flex flex-col gap-4">
			<Avatar v-model="character.avatar" />
			<div class="flex flex-col gap-2">
				<input
					v-model="character.name"
					inputmode="text"
					class="text-center !text-2xl font-bold bg-secondary border-none"
					:aria-label="$t('identity.name.label')"
					:placeholder="$t('identity.name.placeholder')"
				/>
				<input
					v-model="character.race"
					inputmode="text"
					class="text-center !text-lg text-primary/75 bg-secondary border-none"
					:aria-label="$t('identity.race.label')"
					:placeholder="$t('identity.race.placeholder')"
				/>
				<ion-textarea
					v-model="character.description"
					inputmode="text"
					auto-grow
					class="text-center px-2 py-1"
					:aria-label="$t('identity.race.label')"
					:placeholder="$t('identity.description.placeholder')"
				></ion-textarea>
			</div>
		</div>
	</SheetSection>
</template>
