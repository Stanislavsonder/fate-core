<script setup lang="ts">
import { Character } from '@/types'
import SheetSection from '../../../ui/SheetSection.vue'
import { ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import { create } from 'ionicons/icons'
import StressModal from '@/components/CharacterSheet/parts/Stress/StressModal.vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

function onChange(stress: Character['stress']) {
	character.value.stress = stress
}
</script>

<template>
	<SheetSection :title="$t('sections.stress')">
		<template #header>
			<button
				class="flex"
				@click="isModalOpen = true"
			>
				<ion-icon
					class="text-2xl"
					:icon="create"
				/>
			</button>
		</template>
		<section
			v-for="stress in character.stress"
			:key="stress.type"
			class="mb-4"
		>
			<h3 class="font-bold text-lg mb-2 text-center">
				{{ $t(`stress.${stress.type}.name`) }}
			</h3>
			<ul class="flex gap-4 flex-wrap justify-center">
				<li
					v-for="(box, index) in stress.boxes"
					:key="index"
				>
					<label
						class="relative size-10 block border-2 rounded grid place-content-center"
						:class="{
							'opacity-30': box.disabled
						}"
					>
						<span
							v-if="box.checked"
							class="relative inline-block w-8 h-8"
						>
							<span class="absolute inset-0 bg-current w-1.5 h-full left-1/2 transform -translate-x-1/2 rotate-45"></span>
							<span class="absolute inset-0 bg-current h-1.5 w-full top-1/2 transform -translate-y-1/2 rotate-45"></span>
						</span>
						<input
							v-model="stress.boxes[index].checked"
							class="hidden"
							type="checkbox"
							:disabled="box.disabled"
						/>
						<span
							class="absolute -top-3 -left-2 font-black text-xl scale-150 pointer-events-none"
							:class="{
								'text-stroke-3 text-secondary': box.disabled
							}"
						>
							{{ box.count }}
						</span>
					</label>
				</li>
			</ul>
		</section>
		<StressModal
			v-model="isModalOpen"
			:stress="character.stress"
			@save="onChange"
		/>
	</SheetSection>
</template>
