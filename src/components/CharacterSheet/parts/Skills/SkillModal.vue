<script setup lang="ts">
import { BASE_SKILLS, SKILL_USAGE_ICONS } from '@/constants'
import { computed } from 'vue'
import { Skill } from '@/types'
import Button from '../../../ui/Button.vue'
import { chevronDown, chevronUp } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { useI18n } from 'vue-i18n'


const {t} = useI18n()
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

const isModalOpen = defineModel<boolean>({
	default: false
})

// eslint-disable-next-line
// @ts-ignore
const usage = computed<[keyof Skill['usage'], boolean][]>(() => Object.entries(BASE_SKILLS[skill.name].usage))

const title = `${t(`skills.${skill.name}.name`)} ( ${skill.level} ${t('level')} )`
</script>

<template>
	<ModalWindow v-model="isModalOpen" :title>
		<div class="grid grid-cols-4 gap-2 my-4">
			<span
				v-for="[name, isUse] in usage"
				:key="name"
				class="text-center text-xs flex justify-center items-center flex-col text-primary/75 font-bold"
				:class="{
					'opacity-25': !isUse
				}"
			>
				<ion-icon
					:icon="SKILL_USAGE_ICONS[name]"
					class="text-5xl mb-2"
				/>
				{{ $t(`skill.usage.${name}`) }}
			</span>
		</div>
		<p class="p-4">
			{{ $t(`skills.${skill.name}.description`) }}
		</p>
		<div class="grid grid-cols-2 gap-2 gap-y-4 justify-center">
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
			<Button class="col-span-2 bg-danger" @click="emit('remove')">{{ $t('actions.remove') }} </Button>
		</div>
	</ModalWindow>
</template>
