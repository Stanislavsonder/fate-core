<script setup lang="ts">
import SheetSection from '@/components/ui/SheetSection.vue'
import type { Character, FateContext } from '@/types'
import Skill from './parts/Skill.vue'
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import AddNewSkillModal from './parts/AddNewSkillModal.vue'
import { add as addIcon } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import type { CharacterSkills } from '../types'

const { t } = useI18n()

const character = defineModel<Character>({
	required: true
})

const context = inject<Ref<FateContext>>('context')!
const SKILLS = context.value.shared['sonder@core-skills']!.skills!

const isModalOpen = ref<boolean>(false)

const displaySkills = computed<CharacterSkills>(() => {
	const skills: CharacterSkills = {}

	for (const [id, level] of Object.entries(character.value.skills!)) {
		const skill = SKILLS.get(id)
		if (skill) {
			if (!skills[level]) {
				skills[level] = []
			}
			skills[level].push(skill)
		} else {
			console.warn(`Skill with id ${id} not found`)
		}
	}
	for (const level in skills) {
		skills[level].sort((a, b) => t(a.name).localeCompare(t(b.name)))
	}
	return skills
})

function update(id: string, level: number) {
	character.value.skills![id] = level
}

function remove(id: string) {
	delete character.value.skills![id]
}

function add(id: string) {
	character.value.skills![id] = 1
}
</script>

<template>
	<SheetSection :title="$t('sonder@core-skills.label')">
		<template #header>
			<button
				data-testid="open-skills-modal"
				class="flex"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="addIcon"
				/>
			</button>
		</template>

		<ul
			v-if="Object.keys(displaySkills).length"
			class="flex flex-col gap-4"
		>
			<li
				v-for="level in Object.keys(displaySkills).reverse()"
				:key="level"
				class="border-1 border-primary/25 rounded-xl p-4"
			>
				<p class="text-lg !mb-3 text-start">
					<span class="inline-flex items-center justify-center rounded-full bg-primary text-secondary font-bold aspect-square h-8 round border-1 me-2">
						{{ level }}
					</span>
					<span class="font-bold">{{ $t(`sonder@core-skills.modifier.${level}`) }}</span>
				</p>
				<ul class="flex flex-wrap gap-2">
					<li
						v-for="skill in displaySkills[Number(level)]"
						:key="skill.id"
					>
						<Skill
							:id="skill.id"
							:level="Number(level)"
							@update="lvl => update(skill.id, lvl)"
							@remove="remove(skill.id)"
						/>
					</li>
				</ul>
			</li>
		</ul>
		<p
			v-else
			class="min-h-12 flex items-center justify-center text-xl my-6"
		>
			{{ $t('sonder@core-skills.empty') }}
		</p>

		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@core-skills.add-new')"
		>
			<AddNewSkillModal
				:presented-skills="Object.keys(character.skills!)"
				@add="add"
			/>
		</ModalWindow>
	</SheetSection>
</template>
