<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS } from '@/constants'
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'

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
	<div>
		<ul
			v-if="skills.length"
			class="flex flex-col gap-4 p-4"
		>
			<li
				v-for="skill in skills"
				:key="skill"
			>
				<button
					class="flex flex-col border-1 border-primary/20 rounded p-4 w-full"
					@click="emit('add', skill)"
				>
					<span class="flex justify-between font-bold w-full text-lg">
						{{ $t(`skills.list.${skill}.name`) }}
					</span>
					<span class="flex gap-2">
						<ion-icon
							v-for="[usage, isUse] in Object.entries(BASE_SKILLS[skill].usage)"
							:key="usage"
							class="text-2xl py-2"
							:class="{
								'opacity-25': !isUse
							}"
							:icon="SKILL_USAGE_ICONS[usage as keyof typeof SKILL_USAGE_ICONS]"
							:alt="skill"
						/>
					</span>
					<span class="text-left leading-5">
						{{ $t(`skills.list.${skill}.description`) }}
					</span>
				</button>
			</li>
		</ul>
		<p
			v-else
			class="text-center p-4 text-lg"
		>
			{{ $t('skill.empty') }}
		</p>
	</div>
</template>
