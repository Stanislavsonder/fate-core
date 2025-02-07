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
			<div class="md:col-span-4">
				<ion-textarea
					v-model="character.name"
					data-testid="character-name-field"
					auto-grow
					enterkeyhint="done"
					inputmode="text"
					class="text-center !text-2xl font-bold md:text-start md:pl-2"
					:aria-label="$t('identity.form.name.label')"
					:placeholder="$t('identity.form.name.placeholder')"
					:rows="1"
				/>
				<ion-textarea
					v-model="character.race"
					data-testid="character-race-field"
					enterkeyhint="done"
					inputmode="text"
					class="text-center !text-lg text-primary/75 bg-secondary border-none md:text-start md:pl-2"
					:aria-label="$t('identity.form.race.label')"
					:placeholder="$t('identity.form.race.placeholder')"
					auto-grow
					:rows="1"
				/>
				<ion-textarea
					v-model="character.description"
					data-testid="character-description-field"
					enterkeyhint="done"
					inputmode="text"
					auto-grow
					:rows="2"
					class="text-center px-2 py-1 text-pretty md:text-start"
					:aria-label="$t('identity.form.race.label')"
					:placeholder="$t('identity.form.description.placeholder')"
				></ion-textarea>
			</div>
		</div>
	</SheetSection>
</template>
