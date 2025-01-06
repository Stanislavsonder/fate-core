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
		<div class="grid gap-4 md:grid-cols-6">
			<Avatar
				v-model="character.avatar"
				class="md:col-span-2"
			/>
			<div class="md:col-span-4 flex flex-col gap-2">
				<input
					v-model="character.name"
					inputmode="text"
					class="text-center !text-2xl font-bold bg-secondary border-none md:text-left md:pl-2"
					:aria-label="$t('identity.form.name.label')"
					:placeholder="$t('identity.form.name.placeholder')"
				/>
				<input
					v-model="character.race"
					inputmode="text"
					class="text-center !text-lg text-primary/75 bg-secondary border-none md:text-left md:pl-2"
					:aria-label="$t('identity.form.race.label')"
					:placeholder="$t('identity.form.race.placeholder')"
				/>
				<ion-textarea
					v-model="character.description"
					inputmode="text"
					auto-grow
					class="text-center px-2 py-1 text-pretty md:text-left"
					:aria-label="$t('identity.form.race.label')"
					:placeholder="$t('identity.form.description.placeholder')"
				></ion-textarea>
			</div>
		</div>
	</SheetSection>
</template>
