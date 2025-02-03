<script setup lang="ts">
import { Character } from '@/types'
import { computed, ref } from 'vue'
import { clone } from '@/utils/helpers/clone'
import { IonIcon, IonList, IonItem, IonButton, IonNote, IonLabel } from '@ionic/vue'
import { lockClosed, lockOpenOutline, closeCircle, add as addIcon } from 'ionicons/icons'
import { validateStress } from '@/utils/helpers/validators'
import useFate from '@/store/useFate'

const { stress } = defineProps<{
	stress: Character['stress']
}>()

const emit = defineEmits<{
	save: [stress: Character['stress']]
}>()

const { constants, getStress } = useFate()
const newStress = ref<Character['stress']>(clone(stress))

const validationError = computed<string | undefined>(() => validateStress(newStress.value))

function add(id: string) {
	newStress.value[id].push({
		count: 1,
		checked: false,
		disabled: false
	})
}

function remove(id: string, index: number) {
	newStress.value[id]?.splice(index, 1)
}

function save() {
	const keys = Object.keys(newStress.value)
	keys.forEach(key => {
		newStress.value[key].sort((a, b) => (Number(a.disabled) - Number(b.disabled) === 0 ? a.count - b.count : Number(a.disabled) - Number(b.disabled)))
	})
	emit('save', clone(newStress.value))
}
</script>

<template>
	<div class="flex flex-col justify-between h-full">
		<div>
			<ion-list inset>
				<ion-item
					v-for="id in Object.keys(newStress)"
					:key="id"
					lines="full"
					class="p-2"
				>
					<div class="py-2">
						<ion-label class="text-xl m-2 font-bold">
							{{ $t(getStress(id).name) }}
						</ion-label>
						<ul class="flex gap-4 p-2 flex-wrap">
							<li
								v-for="(box, index) in newStress[id]"
								:key="index"
								class="relative"
							>
								<button
									class="absolute flex -right-2 -top-2 text-2xl bg-secondary z-10"
									:aria-label="$t('stress.remove')"
									@click="remove(id, index)"
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
										:max="constants.MAX_STRESS_VALUE"
										:maxlength="constants.MAX_STRESS_VALUE.toString().length"
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
									'opacity-25': newStress[id].length >= constants.MAX_STRESS_BOXES
								}"
							>
								<button
									:disabled="newStress[id].length >= constants.MAX_STRESS_BOXES"
									class="flex text-3xl"
									:aria-label="$t('stress.add-box')"
									@click="add(id)"
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
