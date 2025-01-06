<template>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('sections.consequences')"
	>
		<div>
			<ul class="flex flex-col gap-6 p-2">
				<li
					v-for="(consequence, index) in newConsequences"
					:key="index"
					class="relative h-10 border-1 rounded flex items-center px-2"
					:class="{
						'border-primary/30': consequence.disabled
					}"
				>
					<select
						v-model="consequence.level"
						class="w-full mr-4"
						:disabled="consequence.disabled"
					>
						<option
							v-for="level in Object.values(ConsequenceLevel)"
							:key="level"
							:value="level"
						>
							{{ $t(`consequences.${level}.name`) }}
						</option>
					</select>

					<button
						class="absolute flex -right-2 -top-2 text-2xl bg-secondary z-10"
						@click="remove(index)"
					>
						<ion-icon :icon="closeCircle" />
					</button>

					<label class="absolute -right-2.5 -bottom-2.5 bg-secondary z-10">
						<ion-icon
							class="text-2xl"
							:icon="consequence.disabled ? lockClosed : lockOpenOutline"
						/>
						<input
							v-model="consequence.disabled"
							type="checkbox"
							class="hidden"
						/>
					</label>
				</li>
				<li
					class="flex justify-center items-center border-1 rounded border-dashed"
					:class="{
						'opacity-25': newConsequences.length >= 10
					}"
				>
					<button
						:disabled="newConsequences.length >= 10"
						class="flex text-3xl"
						:aria-label="$t('common.actions.add')"
						@click="add()"
					>
						<ion-icon :icon="addIcon" />
					</button>
				</li>
			</ul>
			<div>
				<Button
					class="!m-2 !ml-auto"
					@click="save"
				>
					{{ $t('common.actions.save') }}
				</Button>
			</div>
		</div>
	</ModalWindow>
</template>

<script setup lang="ts">
import { Consequence, ConsequenceLevel } from '@/types'
import { ref } from 'vue'
import { clone } from '@/utils'
import { add as addIcon, closeCircle, lockClosed, lockOpenOutline } from 'ionicons/icons'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import Button from '@/components/ui/Button.vue'
import { IonIcon } from '@ionic/vue'
import { CONSEQUENCES_LEVELS } from '@/constants'

const { consequences = [] } = defineProps<{
	consequences: Consequence[]
}>()

const emit = defineEmits<{
	save: [consequences: Consequence[]]
}>()

const isModalOpen = defineModel<boolean>({
	default: false
})

const newConsequences = ref<Consequence[]>(clone(consequences))

function add() {
	newConsequences.value.push({
		disabled: false,
		description: '',
		level: ConsequenceLevel.Mild
	})
}

function remove(index: number) {
	newConsequences.value.splice(index, 1)
}

function save() {
	newConsequences.value.sort((a, b) =>
		CONSEQUENCES_LEVELS[a.level] - CONSEQUENCES_LEVELS[b.level] === 0
			? Number(a.disabled) - Number(b.disabled)
			: CONSEQUENCES_LEVELS[a.level] - CONSEQUENCES_LEVELS[b.level]
	)
	emit('save', clone(newConsequences.value))
	isModalOpen.value = false
}
</script>
