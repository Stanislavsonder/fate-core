<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS } from '@/constants'
import { computed } from 'vue'

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
					class="flex flex-col border-1 border-black/20 rounded p-1 px-2 w-full"
					@click="emit('add', skill)"
				>
					<span class="flex justify-between font-bold w-full mb-2">
						{{ $t(`skills.${skill}.name`) }}

						<span class="flex gap-2">
							<img
								v-for="[usage, isUse] in Object.entries(BASE_SKILLS[skill].usage)"
								:key="usage"
								class="w-5"
								:class="{
									'opacity-25': !isUse
								}"
								:src="SKILL_USAGE_ICONS[usage as keyof typeof SKILL_USAGE_ICONS]"
								:alt="skill"
							/>
						</span>
					</span>
					<span class="text-left">
						{{ $t(`skills.${skill}.description`) }}
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
