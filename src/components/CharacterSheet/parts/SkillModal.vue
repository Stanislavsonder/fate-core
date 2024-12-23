<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS } from '@/constants'
import { computed } from 'vue'
import { Skill } from '@/types'
import Button from '../../ui/Button.vue'
import { chevronDown, chevronUp } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'

const { skill } = defineProps<{
	skill: {
		name: string
		level: number
	}
}>()
const emit = defineEmits<{
	remove: []
	up: []
	down: []
}>()

const usage = computed<[keyof Skill['usage'], boolean][]>(() => Object.entries(BASE_SKILLS[skill.name].usage))
</script>

<template>
	<div>
		<div class="grid grid-cols-4 gap-2 my-4">
			<span
				v-for="[name, isUse] in usage"
				:key="name"
				class="text-center text-xs flex justify-center items-center flex-col text-primary/75 font-bold"
				:class="{
					'opacity-25': !isUse
				}"
			>
				<img
					:src="SKILL_USAGE_ICONS[name]"
					class="w-10 mb-1"
				/>
				{{ $t(`skill.usage.${name}`) }}
			</span>
		</div>
		<p class="p-4">
			{{ $t(`skills.${skill.name}.description`) }}
		</p>
		<div class="flex flex-wrap gap-2 justify-center">
			<Button
				:disabled="skill.level >= 10"
				@click="emit('up')"
			>
				<ion-icon
					class="text-2xl"
					:icon="chevronUp"
				/>
				{{ $t('skill.level.up') }}
			</Button>
			<Button
				:disabled="skill.level <= 0"
				@click="emit('down')"
			>
				<ion-icon
					class="text-2xl"
					:icon="chevronDown"
				/>
				{{ $t('skill.level.down') }}
			</Button>
			<Button @click="emit('remove')">{{ $t('actions.remove') }} </Button>
		</div>
	</div>
</template>
