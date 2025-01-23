<script setup lang="ts">
import { ref } from 'vue'
import { chevronDown, chevronUp } from 'ionicons/icons'
import { IonIcon, IonButton, IonList, IonItem, IonLabel } from '@ionic/vue'
import { Skill } from '@/types'
import useFate from '@/store/useFate'

const { id, level: initialLevel } = defineProps<{
	id: string
	level: number
}>()

const emit = defineEmits<{
	remove: []
	update: [level: number]
}>()

const fate = useFate()
const constants = fate.constants
const level = ref<number>(initialLevel)
const skill: Skill = fate.getSkill(id)

function up() {
	level.value = Math.min(constants.MAX_SKILL_LEVEL, level.value + 1)
}

function down() {
	level.value = Math.max(constants.MIN_SKILL_LEVEL, level.value - 1)
}

function save() {
	emit('update', level.value)
}

function remove() {
	emit('remove')
}
</script>

<template>
	<div class="flex flex-col justify-between h-full">
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
							v-for="usage in constants.SKILL_USAGE"
							:key="usage.type"
							class="text-center text-xs flex justify-center items-center flex-col text-primary/75 font-bold"
							:class="{
								'opacity-25': !skill.usage[usage.type]
							}"
						>
							<ion-icon
								:icon="usage.icon"
								class="mb-2 text-4xl"
							/>
							<span>
								{{ $t(`skills.usage.${usage.type}`) }}
							</span>
						</p>
					</div>
				</ion-item>
				<ion-item>
					<p class="text-center text-5xl w-full py-4">
						{{ level }}
						<br />
						<span class="text-2xl">{{ $t(`modifier.${level}`) }}</span>
					</p>
				</ion-item>
			</ion-list>
			<ion-button
				class="col-span-4"
				color="danger"
				fill="clear"
				expand="block"
				@click="remove"
			>
				{{ $t('common.actions.remove') }}
			</ion-button>
		</div>
		<div class="m-4">
			<div class="grid grid-cols-2">
				<ion-button
					fill="outline"
					:disabled="level <= constants.MIN_SKILL_LEVEL"
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
					:disabled="level >= constants.MAX_SKILL_LEVEL"
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
				@click="save"
			>
				{{ $t('common.actions.save') }}
			</ion-button>
		</div>
	</div>
</template>
