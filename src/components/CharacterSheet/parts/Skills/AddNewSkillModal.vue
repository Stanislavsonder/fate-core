<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS, SKILL_USAGE_ORDERED } from '@/utils/constants'
import { computed } from 'vue'
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import { SkillUsageType } from '@/types'

const { presentedSkills } = defineProps<{
	presentedSkills: string[]
}>()

const { t } = useI18n()
const skills = computed(() => {
	return Object.keys(BASE_SKILLS)
		.filter(skill => !presentedSkills.includes(skill))
		.sort((a, b) => t(`skills.list.${a}.name`).localeCompare(t(`skills.list.${b}.name`)))
})

function isSkillUsedFor(skill: string, usage: SkillUsageType): boolean {
	return BASE_SKILLS[skill].usage[usage]
}

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
							'opacity-25': isSkillUsedFor(skill, usage)
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
