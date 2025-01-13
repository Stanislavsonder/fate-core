<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS, SKILL_USAGE_ORDERED } from '@/constants'
import { computed } from 'vue'
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue'

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
			<ion-label class="flex justify-between w-full py-4">
				<h3 class="!text-xl !font-bold">{{ $t(`skills.list.${skill}.name`) }}</h3>
				<h4 class="flex gap-3">
					<ion-icon
						v-for="usage in SKILL_USAGE_ORDERED"
						:key="usage"
						class="text-3xl py-2 text-primary/75"
						:class="{
							// @ts-ignore
							'opacity-25': !BASE_SKILLS[skill].usage[usage]
						}"
						:icon="SKILL_USAGE_ICONS[usage]"
						:alt="skill"
					/>
				</h4>
				<p class="!text-base">
					{{ $t(`skills.list.${skill}.description`) }}
				</p>
			</ion-label>
		</ion-item>
		<ion-item
			v-if="!skills.length"
			class="text-center p-4 text-lg"
		>
			{{ $t('skills.nothing-to-add') }}
		</ion-item>
	</ion-list>
</template>
