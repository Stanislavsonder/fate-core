<script setup lang="ts">
import SheetSection from '../../../ui/SheetSection.vue'
import { Character, CharacterSkills } from '@/types'
import Skill from './Skill.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import ModalWindow from '../../../ui/ModalWindow.vue'
import AddNewSkillModal from './AddNewSkillModal.vue'
import { add as addIcon } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import useFate from '@/store/useFate'

const fate = useFate()
const { t } = useI18n()

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

const displaySkills = computed<CharacterSkills>(() => {
	const allSkills = fate.context.skills.map
	const skills: CharacterSkills = {}

	for (const [id, level] of Object.entries(character.value.skills)) {
		const skill = allSkills.get(id)
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
	character.value.skills[id] = level
}

function remove(id: string) {
	delete character.value.skills[id]
}

function add(id: string) {
	character.value.skills[id] = 1
}
</script>

<template>
	<SheetSection :title="$t('sections.skills')">
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
					<span class="font-bold">{{ $t(`modifier.${level}`) }}</span>
				</p>
				<ul class="flex flex-wrap gap-2">
					<li
						v-for="skill in displaySkills[Number(level)]"
						:key="skill._id"
					>
						<Skill
							:id="skill._id"
							:level="Number(level)"
							@update="lvl => update(skill._id, lvl)"
							@remove="remove(skill._id)"
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
			:title="$t('skills.add-new')"
		>
			<AddNewSkillModal
				:presented-skills="Object.keys(character.skills)"
				@add="add"
			/>
		</ModalWindow>
	</SheetSection>
</template>
