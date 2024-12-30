<script setup lang="ts">
import useModal from '@/composables/useModal'
import SheetSection from './SheetSection.vue'
import { close } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'

const { title = '' } = defineProps<{
	title?: string
}>()

const isOpen = defineModel<boolean>({
	default: false
})

useModal(isOpen)

function handleClick(event: MouseEvent) {
	if (event.target === event.currentTarget) {
		isOpen.value = false
	}
}
</script>

<template>
	<Teleport
		v-if="isOpen"
		to="body"
	>
		<dialog
			class="fixed flex w-full h-full bg-black/75 justify-center items-center top-0 left-0"
			@click="handleClick"
		>
			<SheetSection
				:title="title"
				class="w-full m-4 max-h-full"
			>
				<template #header>
					<button
						class="inline-flex"
						autofocus
						@click="isOpen = false"
					>
						<ion-icon
							class="text-2xl"
							:icon="close"
						/>
					</button>
				</template>

				<div class="max-h-150 overflow-auto">
					<slot />
				</div>
			</SheetSection>
		</dialog>
	</Teleport>
</template>
