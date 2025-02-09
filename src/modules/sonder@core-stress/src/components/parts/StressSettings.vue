<script setup lang="ts">
import type { Character, FateContext } from '@/types'
import { computed, inject, type Ref, ref } from 'vue'
import { clone } from '@/utils/helpers/clone'
import { IonIcon, IonList, IonItem, IonButton, IonNote, IonLabel } from '@ionic/vue'
import { lockClosed, lockOpenOutline, closeCircle, add as addIcon } from 'ionicons/icons'
import { validateStress } from '../../utils/validators'

const { stress } = defineProps<{
	stress: Character['stress']
}>()

const emit = defineEmits<{
	save: [stress: Character['stress']]
}>()

const context = inject<Ref<FateContext>>('context')!
const newStress = ref<Character['stress']>(clone(stress))

const validationError = computed<string | undefined>(() =>
	validateStress(newStress.value, {
		MAX_STRESS_VALUE: context.value.constants.MAX_STRESS_VALUE
	})
)

function addBox(stressTypeIndex: number) {
	newStress.value[stressTypeIndex].boxes.push({
		count: 1,
		checked: false,
		disabled: false
	})
}

function removeBox(stressTypeIndex: number, boxIndex: number) {
	newStress.value[stressTypeIndex].boxes.splice(boxIndex, 1)
}

function save() {
	for (const stressType of newStress.value) {
		stressType.boxes.sort((a, b) => (Number(a.disabled) - Number(b.disabled) === 0 ? a.count - b.count : Number(a.disabled) - Number(b.disabled)))
	}
	emit('save', clone(newStress.value))
}
</script>

<template>
	<div class="flex flex-col justify-between h-full">
		<div>
			<ion-list inset>
				<ion-item
					v-for="(stressType, stressTypeIndex) in newStress"
					:key="stressType.id"
					lines="full"
					class="p-2"
				>
					<div class="py-2">
						<ion-label class="text-xl m-2 font-bold">
							{{ $t(stressType.name) }}
						</ion-label>
						<ul class="flex gap-4 p-2 flex-wrap">
							<li
								v-for="(box, boxIndex) in stressType.boxes"
								:key="boxIndex"
								class="relative"
							>
								<button
									class="absolute flex -right-2 -top-2 text-2xl bg-list z-10"
									:aria-label="$t('sonder@core-stress.removeBox')"
									@click="removeBox(stressTypeIndex, boxIndex)"
								>
									<ion-icon
										:icon="closeCircle"
										aria-hidden="true"
									/>
								</button>
								<label
									:aria-label="$t('sonder@core-stress.level')"
									class="relative size-15 border-2 rounded flex place-content-center"
									:class="{
										'opacity-30': box.disabled
									}"
								>
									<input
										v-model.number="box.count"
										inputmode="numeric"
										type="number"
										:disabled="box.disabled"
										class="font-bold text-xl text-center w-full h-full"
										min="1"
										:max="context.constants.MAX_STRESS_VALUE"
										:maxlength="context.constants.MAX_STRESS_VALUE.toString().length"
										minlength="1"
									/>
								</label>
								<label
									:aria-label="$t(`sonder@core-stress.${box.disabled ? 'unlockBox' : 'lockBox'}`)"
									class="absolute -right-2.5 -bottom-2.5 bg-list z-10"
									role="checkbox"
									tabindex="0"
									@keydown.enter.prevent="box.disabled = !box.disabled"
									@keydown.space.prevent="box.disabled = !box.disabled"
								>
									<ion-icon
										class="text-2xl"
										:icon="box.disabled ? lockClosed : lockOpenOutline"
										aria-hidden="true"
									/>
									<input
										v-model="box.disabled"
										type="checkbox"
										class="hidden"
									/>
								</label>
							</li>
							<li
								class="size-15 flex justify-center items-center border-1 rounded border-dashed"
								:class="{
									'opacity-25': stressType.boxes.length >= context.constants.MAX_STRESS_BOXES
								}"
							>
								<button
									:disabled="stressType.boxes.length >= context.constants.MAX_STRESS_BOXES"
									class="flex text-3xl"
									:aria-label="$t('sonder@core-stress.addBox')"
									@click="addBox(stressTypeIndex)"
								>
									<ion-icon
										:icon="addIcon"
										aria-hidden="true"
									/>
								</button>
							</li>
						</ul>
					</div>
				</ion-item>
			</ion-list>
			<Transition name="fade-in">
				<ion-note
					:aria-label="$t('a11y.validation-error')"
					class="px-4 block text-center min-h-5"
					color="danger"
				>
					<template v-if="validationError">
						{{ validationError }}
					</template>
				</ion-note>
			</Transition>
		</div>
		<div class="p-4">
			<ion-button
				:disabled="!!validationError"
				expand="block"
				@click="save"
			>
				{{ $t('common.actions.save') }}
			</ion-button>
		</div>
	</div>
</template>
