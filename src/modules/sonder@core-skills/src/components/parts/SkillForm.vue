<script setup lang="ts">
import { inject, type Ref, ref } from 'vue'
import { chevronDown, chevronUp } from 'ionicons/icons'
import { IonIcon, IonButton, IonList, IonItem, IonLabel } from '@ionic/vue'
import type { FateContext } from '@/types'
import type { Skill } from '../../types'

const { id, level: initialLevel } = defineProps<{
	id: string
	level: number
}>()

const emit = defineEmits<{
	remove: []
	update: [level: number]
}>()

const context = inject<Ref<FateContext>>('context')!
const SKILLS = context.value.shared['sonder@core-skills']!.skills!

const constants = context.value.constants
const level = ref<number>(initialLevel)
const skill: Skill | undefined = SKILLS.get(id)

function up() {
	level.value = Math.min(constants.MAX_SKILL_LEVEL!, level.value + 1)
}

function down() {
	level.value = Math.max(constants.MIN_SKILL_LEVEL!, level.value - 1)
}

function save() {
	emit('update', level.value)
}

function remove() {
	emit('remove')
}
</script>

<template>
	<div
		v-if="skill"
		class="flex flex-col justify-between h-full"
	>
		<div>
			<ion-list inset>
				<ion-item>
					<ion-label>
						<h2 class="text-center !text-xl !font-bold !mb-2">
							{{ $t(skill.name) }}
						</h2>
						<p class="text-center w-full">
							{{ $t(skill.description) }}
						</p>
					</ion-label>
				</ion-item>
				<ion-item>
					<div class="grid grid-cols-4 gap-2 gap-y-8 my-6 w-full">
						<p
							v-for="[usage, icon] in Object.entries(constants.SKILL_USAGE_ICON!)"
							:key="usage"
							class="text-center text-xs flex justify-center items-center flex-col text-primary/75 font-bold"
							:class="{
								'opacity-25': !skill.usage[usage as keyof Skill['usage']]
							}"
						>
							<ion-icon
								:icon="icon"
								class="mb-2 text-4xl"
							/>
							<span>
								{{ $t(`sonder@core-skills.usage.${usage}`) }}
							</span>
						</p>
					</div>
				</ion-item>
				<ion-item>
					<p
						class="text-center text-5xl w-full py-4"
						data-testid="skill-level"
						:aria-label="$t('sonder@core-skills.level.label')"
					>
						{{ level }}
						<br />
						<span class="text-2xl">{{ $t(`sonder@core-skills.modifier.${level}`) }}</span>
					</p>
				</ion-item>
			</ion-list>
			<ion-button
				class="col-span-4"
				color="danger"
				fill="clear"
				expand="block"
				data-testid="remove-skill-button"
				@click="remove"
			>
				{{ $t('common.actions.remove') }}
			</ion-button>
		</div>
		<div class="m-4">
			<div class="grid grid-cols-2">
				<ion-button
					fill="outline"
					:disabled="level <= constants.MIN_SKILL_LEVEL!"
					data-testid="level-down-button"
					:aria-label="$t('common.actions.decrease')"
					@click="down"
				>
					<ion-icon
						:icon="chevronDown"
						aria-hidden="true"
					/>
				</ion-button>

				<ion-button
					fill="outline"
					data-testid="level-up-button"
					:disabled="level >= constants.MAX_SKILL_LEVEL!"
					:aria-label="$t('common.actions.increase')"
					@click="up"
				>
					<ion-icon
						:icon="chevronUp"
						aria-hidden="true"
					/>
				</ion-button>
			</div>
			<ion-button
				expand="block"
				data-testid="save-skill-button"
				@click="save"
			>
				{{ $t('common.actions.save') }}
			</ion-button>
		</div>
	</div>
</template>
