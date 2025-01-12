<script setup lang="ts">
import { BASE_SKILLS, MAX_SKILL_LEVEL, MIN_SKILL_LEVEL, SKILL_USAGE_ICONS, SKILL_USAGE_ORDERED } from '@/constants'
import { ref } from 'vue'
import { chevronDown, chevronUp } from 'ionicons/icons'
import { IonIcon, IonButton, IonList, IonItem } from '@ionic/vue'

const { skill } = defineProps<{
	skill: {
		name: string
		level: number
	}
}>()
const emit = defineEmits<{
	remove: []
	update: [level: number]
}>()

const level = ref<number>(skill.level)

function up() {
	level.value = Math.min(MAX_SKILL_LEVEL, level.value + 1)
}

function down() {
	level.value = Math.max(MIN_SKILL_LEVEL, level.value - 1)
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
							{{ $t(`skills.list.${skill.name}.name`) }}
						</h2>
						<p class="text-center w-full">
							{{ $t(`skills.list.${skill.name}.description`) }}
						</p>
					</ion-label>
				</ion-item>
				<ion-item>
					<div class="grid grid-cols-4 gap-2 gap-y-8 my-6 w-full">
						<p
							v-for="name in SKILL_USAGE_ORDERED"
							:key="name"
							class="text-center text-xs flex justify-center items-center flex-col text-primary/75 font-bold"
							:class="{
								// @ts-ignore
								'opacity-25': !BASE_SKILLS[skill.name].usage[name]
							}"
						>
							<ion-icon
								:icon="SKILL_USAGE_ICONS[name]"
								class="mb-2 text-4xl"
							/>
							<span>
								{{ $t(`skills.usage.${name}`) }}
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
					:disabled="level <= MIN_SKILL_LEVEL"
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
					:disabled="level >= MAX_SKILL_LEVEL"
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
