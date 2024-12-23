<template>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('sections.stress')"
	>
		<div>
			<ul>
				<li
					v-for="stressItem in newStress"
					:key="stressItem.type"
					class="not-last:border-b-2 p-2 pb-4"
				>
					<h3 class="text-xl m-2 font-bold">
						{{ $t(`stress.${stressItem.type}.name`) }}
					</h3>

					<ul class="flex gap-4 p-2 flex-wrap">
						<li
							v-for="(box, index) in stressItem.boxes"
							:key="`${box.count}-${index}-${box.disabled}-${box.checked}`"
							class="relative"
						>
							<button
								class="absolute flex -right-2 -top-2 text-2xl bg-secondary z-10"
								@click="remove(stressItem.type, index)"
							>
								<ion-icon :icon="closeCircle" />
							</button>
							<label
								class="relative size-15 block border-2 rounded grid place-content-center"
								:class="{
									'opacity-30': box.disabled
								}"
							>
								<ion-input
									v-model="box.count"
									type="number"
									:value="box.count"
									:disabled="box.disabled"
									class="font-bold !text-xl text-center"
									min="1"
									max="10"
								/>
							</label>
							<label class="absolute -right-2.5 -bottom-2.5 bg-secondary z-10">
								<ion-icon
									class="text-2xl"
									:icon="box.disabled ? lockClosed : lockOpenOutline"
								/>
								<input
									v-model="box.disabled"
									type="checkbox"
									class="hidden"
								/>
							</label>
						</li>
						<li
class="size-15 flex justify-center items-center border-1 rounded border-dashed" :class="{
									'opacity-25': stressItem.boxes.length >= 10,
								}">
							<button
								:disabled="stressItem.boxes.length >= 10"
								class="flex text-3xl"
								:aria-label="$t('actions.add')"
								@click="add(stressItem.type)"
							>
								<ion-icon :icon="addIcon" />
							</button>
						</li>
					</ul>
				</li>
			</ul>
			<div>
				<Button
					class="!m-2 !ml-auto"
					@click="save"
				>
					{{ $t('actions.save') }}
				</Button>
			</div>
		</div>
	</ModalWindow>
</template>

<script setup lang="ts">
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { Character } from '@/types'
import { ref } from 'vue'
import { clone } from '@/utils'
import { IonInput, IonIcon } from '@ionic/vue'
import { lockClosed, lockOpenOutline, closeCircle, add as addIcon } from 'ionicons/icons'
import Button from '@/components/ui/Button.vue'

const { stress = [] } = defineProps<{
	stress: Character['stress']
}>()

const emit = defineEmits<{
	save: [stress: Character['stress']]
}>()

const isModalOpen = defineModel<boolean>({
	default: false
})

const newStress = ref<Character['stress']>(clone(stress))

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
	emit('save', newStress.value)
	isModalOpen.value = false
}
</script>
