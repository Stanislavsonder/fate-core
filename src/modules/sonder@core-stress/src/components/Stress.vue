<script setup lang="ts">
import type { Character } from '@/types'
import SheetSection from '@/components/ui/SheetSection.vue'
import { ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import { settings } from 'ionicons/icons'
import StressSettings from './parts/StressSettings.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

function onReconfigure(stress: Character['stress']) {
	character.value.stress = stress
	isModalOpen.value = false
}
</script>

<template>
	<SheetSection :title="$t('sonder@core-stress.label')">
		<template #header>
			<button
				class="flex"
				:aria-label="$t('sonder@core-stress.configureBoxes')"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="settings"
					aria-hidden="true"
				/>
			</button>
		</template>
		<section
			v-for="(stressType, stressTypeIndex) in character.stress"
			:key="stressType.id"
			class="mb-4"
		>
			<h3 class="font-bold text-lg mb-2 text-center">
				{{ $t(stressType.name) }}
			</h3>
			<ul class="flex gap-4 flex-wrap justify-center">
				<li
					v-for="(box, boxIndex) in stressType.boxes"
					:key="boxIndex"
				>
					<label
						:aria-label="$t('sonder@core-stress.box', { count: box.count, disabled: box.disabled ? $t('common.state.disabled') : '' })"
						class="relative size-10 border-2 border-primary rounded grid place-content-center"
						:class="{
							'opacity-30': box.disabled
						}"
						role="checkbox"
						:tabindex="box.disabled ? -1 : 0"
						@keydown.enter.prevent="box.disabled = !box.disabled"
						@keydown.space.prevent="box.disabled = !box.disabled"
					>
						<span
							v-if="box.checked"
							aria-hidden="true"
							class="relative inline-block w-8 h-8"
						>
							<span class="absolute inset-0 bg-current w-1.5 h-full left-1/2 transform -translate-x-1/2 rotate-45"></span>
							<span class="absolute inset-0 bg-current h-1.5 w-full top-1/2 transform -translate-y-1/2 rotate-45"></span>
						</span>
						<input
							v-model="character.stress![stressTypeIndex].boxes[boxIndex].checked"
							aria-hidden="true"
							class="hidden"
							type="checkbox"
							:disabled="box.disabled"
						/>
						<span
							aria-hidden="true"
							class="absolute -start-2 -top-3 font-black text-xl scale-150 pointer-events-none"
							:class="{
								'text-stroke-black text-secondary': box.disabled,
								'text-stroke-white': !box.disabled
							}"
						>
							{{ box.count }}
						</span>
					</label>
				</li>
			</ul>
		</section>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@core-stress.label')"
			sheet
		>
			<StressSettings
				:stress="character.stress!"
				@save="onReconfigure"
			/>
		</ModalWindow>
	</SheetSection>
</template>
