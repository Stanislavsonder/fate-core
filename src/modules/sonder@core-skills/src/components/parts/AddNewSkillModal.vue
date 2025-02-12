<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import type { FateContext } from '@/types'
import type { Skill } from '../../types'

const { presentedSkills } = defineProps<{
	presentedSkills: string[]
}>()

const { t } = useI18n()

const context = inject<Ref<FateContext>>('context')!
const SKILLS = context.value.shared['sonder@core-skills']!.skills!

const skillsList = computed<Skill[]>(() => {
	return [...SKILLS.values()]
		.filter(skill => !presentedSkills.includes(skill.id))
		.sort((a, b) => {
			return t(a.name).localeCompare(t(b.name))
		})
})

const emit = defineEmits<{
	add: [string]
}>()
</script>

<template>
	<ion-list inset>
		<ion-item
			v-for="skill in skillsList"
			:key="skill.id"
			button
			lines="full"
			data-testid="add-skill-button"
			@click="emit('add', skill.id)"
		>
			<ion-label class="flex justify-between w-full py-4">
				<h3 class="!text-xl !font-bold">{{ $t(skill.name) }}</h3>
				<h4 class="flex gap-3">
					<ion-icon
						v-for="[usage, icon] in Object.entries(context.constants.SKILL_USAGE_ICON!)"
						:key="usage"
						class="text-3xl py-2 text-primary/75"
						:class="{
							'opacity-25': !skill.usage[usage as keyof Skill['usage']]
						}"
						:icon="icon"
						:alt="skill"
					/>
				</h4>
				<p class="!text-base">
					{{ $t(skill.description) }}
				</p>
			</ion-label>
		</ion-item>
		<ion-item
			v-if="!skillsList.length"
			class="text-center p-4 text-lg"
		>
			{{ $t('sonder@core-skills.nothing-to-add') }}
		</ion-item>
	</ion-list>
</template>
