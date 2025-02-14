<script setup lang="ts">
import type { FateContext } from '@/types'
import { inject, type Ref, ref } from 'vue'
import { clone } from '@/utils/helpers/clone'
import { add as addIcon, closeCircle, lockClosed, lockOpenOutline } from 'ionicons/icons'
import { IonIcon, IonList, IonItem, IonButton } from '@ionic/vue'
import type { Consequence } from '../../types'
import { ConsequenceLevel } from '../../types'

const { consequences = [] } = defineProps<{
	consequences: Consequence[]
}>()

const emit = defineEmits<{
	save: [consequences: Consequence[]]
}>()

const context = inject<Ref<FateContext>>('context')!
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
		context.value.constants.CONSEQUENCES_LEVELS![a.level] - context.value.constants.CONSEQUENCES_LEVELS![b.level] === 0
			? Number(a.disabled) - Number(b.disabled)
			: context.value.constants.CONSEQUENCES_LEVELS![a.level] - context.value.constants.CONSEQUENCES_LEVELS![b.level]
	)
	emit('save', clone(newConsequences.value))
}
</script>

<template>
	<div class="flex flex-col justify-between h-full">
		<div>
			<ion-list inset>
				<ion-item
					v-for="(consequence, index) in newConsequences"
					:key="index"
					lines="full"
				>
					<div
						class="relative h-10 border-1 rounded flex items-center m-4 w-full"
						:class="{
							'border-primary/30': consequence.disabled
						}"
					>
						<select
							v-model="consequence.level"
							:aria-label="$t('sonder@core-consequences.level')"
							class="w-full mx-4 mr-6"
							:disabled="consequence.disabled"
						>
							<option
								v-for="level in Object.values(ConsequenceLevel)"
								:key="level"
								:value="level"
							>
								{{ $t(`sonder@core-consequences.type.${level}.name`) }}
							</option>
						</select>
						<button
							class="absolute flex -right-2 -top-2 text-2xl bg-list z-10"
							:aria-label="$t('sonder@core-consequences.remove')"
							@click="remove(index)"
						>
							<ion-icon
								:icon="closeCircle"
								aria-hidden="true"
							/>
						</button>

						<label
							:aria-label="$t(`sonder@core-consequences.${consequence.disabled ? 'locked' : 'unlocked'}`)"
							class="absolute -right-2.5 -bottom-2.5 bg-list z-10"
							role="checkbox"
							tabindex="0"
							@keydown.enter.prevent="consequence.disabled = !consequence.disabled"
							@keydown.space.prevent="consequence.disabled = !consequence.disabled"
						>
							<ion-icon
								class="text-2xl"
								:icon="consequence.disabled ? lockClosed : lockOpenOutline"
								aria-hidden="true"
							/>
							<input
								v-model="consequence.disabled"
								type="checkbox"
								class="hidden"
							/>
						</label>
					</div>
				</ion-item>
			</ion-list>
			<ion-button
				fill="clear"
				expand="block"
				:disabled="newConsequences.length >= context.constants.MAX_CONSEQUENCE_BOXES!"
				@click="add"
			>
				<ion-icon
					slot="start"
					:icon="addIcon"
					aria-hidden="true"
				/>
				{{ $t('sonder@core-consequences.add') }}
			</ion-button>
		</div>

		<ion-button
			class="m-4"
			expand="block"
			@click="save"
		>
			{{ $t('common.actions.save') }}
		</ion-button>
	</div>
</template>
