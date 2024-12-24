<script setup lang="ts">
import SheetSection from '../../../ui/SheetSection.vue'
import { Character } from '@/types'
import Skill from './Skill.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import ModalWindow from '../../../ui/ModalWindow.vue'
import AddNewSkillModal from './AddNewSkillModal.vue'
import { add as addIcon } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'

const { t } = useI18n()
const skills = defineModel<Character['skills']>({
	required: true
})

const isModalOpen = ref<boolean>(false)

const displaySkills = computed(() => {
	const tmpSkills: Record<string, string[]> = {}
	for (const [name, level] of Object.entries(skills.value)) {
		if (tmpSkills[level]) {
			tmpSkills[level].push(name)
		} else {
			tmpSkills[level] = [name]
		}
	}

	for (const skillsList of Object.values(tmpSkills)) {
		skillsList.sort((a, b) => t(`skills.${a}.name`).localeCompare(t(`skills.${b}.name`)))
	}
	return tmpSkills
})

function up(skillName: string) {
	skills.value[skillName] += 1
}

function add(skillName: string) {
	skills.value[skillName] = 0
}
</script>

<template>
	<SheetSection :title="$t('sections.skills')">
		<template #header>
			<button
				class="flex"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="addIcon"
				/>
			</button>
		</template>

		<ul v-if="Object.keys(skills).length" class="flex flex-col gap-4">
			<li
				v-for="level in Object.keys(displaySkills).reverse()"
				:key="level"
				class="border-1 border-primary/25 rounded-xl p-4"
			>
				<p class="text-lg !mb-3 text-left">
					<span class="inline-flex items-center justify-center rounded-full bg-primary text-secondary font-bold aspect-square h-8 round border-1 mr-2">
						{{ level }}
					</span>
					<span class="font-bold">{{ $t(`modifier.${level}`) }}</span>
				</p>
				<ul class="flex flex-wrap gap-2">
					<li
						v-for="skill in displaySkills[level]"
						:key="skill"
					>
						<Skill
							:name="skill"
							:level="Number(level)"
							@up="up(skill)"
							@down="skills[skill] -= 1"
							@remove="delete skills[skill]"
						/>
					</li>
				</ul>
			</li>
		</ul>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('skills.empty') }}
		</p>

		<ModalWindow
			v-model="isModalOpen"
			:title="$t('skill.add-new')"
		>
			<AddNewSkillModal
				:presented-skills="Object.keys(skills)"
				@add="add"
			/>
		</ModalWindow>
	</SheetSection>
</template>
