<script setup lang="ts">
import { Stress } from '@/types'
import { computed, ref } from 'vue'
import { clone } from '@/utils'
import { IonIcon, IonList, IonItem, IonButton, IonNote, IonLabel } from '@ionic/vue'
import { lockClosed, lockOpenOutline, closeCircle, add as addIcon } from 'ionicons/icons'
import { validateStress } from '@/utils/validators'
import { MAX_STRESS_BOXES, MAX_STRESS_VALUE } from '@/utils/constants'

const { stress = [] } = defineProps<{
	stress: Stress[]
}>()

const emit = defineEmits<{
	save: [stress: Stress[]]
}>()

const newStress = ref<Stress[]>(clone(stress))

const validationError = computed<string | undefined>(() => validateStress(newStress.value))

function add(type: string) {
	newStress.value
		.find(stressItem => stressItem.type === type)
		?.boxes.push({
			count: 1,
			checked: false,
			disabled: false
		})
}

function remove(type: string, index: number) {
	newStress.value.find(stressItem => stressItem.type === type)?.boxes.splice(index, 1)
}

function save() {
	newStress.value.forEach(stressItem => {
		stressItem.boxes.sort((a, b) => (Number(a.disabled) - Number(b.disabled) === 0 ? a.count - b.count : Number(a.disabled) - Number(b.disabled)))
	})

	emit('save', clone(newStress.value))
}
</script>

<template>
	<form
		class="flex flex-col justify-between h-full"
		@submit.prevent="save"
	>
		<div>
			<ion-list inset>
				<ion-item
					v-for="stressItem in newStress"
					:key="stressItem.type"
					lines="full"
					class="p-2"
				>
					<div class="py-2">
						<ion-label class="text-xl m-2 font-bold">
							{{ $t(`stress.type.${stressItem.type}.name`) }}
						</ion-label>
						<ul class="flex gap-4 p-2 flex-wrap">
							<li
								v-for="(box, index) in stressItem.boxes"
								:key="index"
								class="relative"
							>
								<button
									class="absolute flex -right-2 -top-2 text-2xl bg-secondary z-10"
									type="button"
									:aria-label="$t('stress.remove')"
									@click="remove(stressItem.type, index)"
								>
									<ion-icon
										:icon="closeCircle"
										aria-hidden="true"
									/>
								</button>
								<label
									:aria-label="$t('stress.level')"
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
										:max="MAX_STRESS_VALUE"
										:maxlength="MAX_STRESS_VALUE.toString().length"
										minlength="1"
									/>
								</label>
								<label
									:aria-label="$t(`stress.${box.disabled ? 'unlock' : 'lock'}`)"
									class="absolute -right-2.5 -bottom-2.5 bg-secondary z-10"
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
									'opacity-25': stressItem.boxes.length >= MAX_STRESS_BOXES
								}"
							>
								<button
									type="button"
									:disabled="stressItem.boxes.length >= MAX_STRESS_BOXES"
									class="flex text-3xl"
									:aria-label="$t('stress.add-box')"
									@click="add(stressItem.type)"
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
				type="submit"
			>
				{{ $t('common.actions.save') }}
			</ion-button>
		</div>
	</form>
</template>
