<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS, SKILL_USAGE_ORDERED } from '@/constants'
import { computed } from 'vue'
import { IonIcon, IonList, IonItem, IonNote, IonLabel } from '@ionic/vue'

const { presentedSkills } = defineProps<{
	presentedSkills: string[]
}>()

const skills = computed(() => {
	return Object.keys(BASE_SKILLS).filter(skill => !presentedSkills.includes(skill))
})

const emit = defineEmits<{
	add: [string]
}>()
</script>

<template>
	<ion-list inset>
		<ion-item
			v-for="skill in skills"
			:key="skill"
			button
			lines="full"
			@click="emit('add', skill)"
		>
			<ion-label
				slot="start"
				class="flex justify-between font-bold w-full text-xl py-4"
			>
				{{ $t(`skills.list.${skill}.name`) }}
				<p class="flex gap-2">
					<ion-icon
						v-for="usage in SKILL_USAGE_ORDERED"
						:key="usage"
						class="text-2xl py-2 text-primary/75"
						:class="{
							// @ts-ignore
							'opacity-25': !BASE_SKILLS[skill].usage[usage]
						}"
						:icon="SKILL_USAGE_ICONS[usage]"
						:alt="skill"
					/>
				</p>
			</ion-label>
			<ion-note class="flex items-center h-full">
				{{ $t(`skills.list.${skill}.description`) }}
			</ion-note>
		</ion-item>
		<ion-item
			v-if="!skills.length"
			class="text-center p-4 text-lg"
		>
			{{ $t('skills.nothing-to-add') }}
		</ion-item>
	</ion-list>
</template>
