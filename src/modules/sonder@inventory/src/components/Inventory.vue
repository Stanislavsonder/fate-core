<script setup lang="ts">
import type { Item as ItemType } from '../types'
import type { Character } from '@/types'
import SheetSection from '@/components/ui/SheetSection.vue'
import { IonIcon, IonList, IonReorderGroup } from '@ionic/vue'
import Item from '@/modules/sonder@inventory/src/components/parts/Item.vue'
import { add } from 'ionicons/icons'
import { ref } from 'vue'
import ItemForm from '@/modules/sonder@inventory/src/components/parts/ItemForm.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

const character = defineModel<Character>({
	required: true
})

const isModalOpen = ref<boolean>(false)

function handleReorder(event: CustomEvent) {
	character.value.inventory = event.detail.complete(character.value.inventory)
}

function openModal() {
	isModalOpen.value = true
}

function onAdd(item: ItemType) {
	character.value.inventory!.push(item)
	isModalOpen.value = false
}

function updateItem(item: ItemType, index: number) {
	character.value.inventory![index] = item
}

function removeItem(index: number) {
	character.value.inventory!.splice(index, 1)
}
</script>

<template>
	<SheetSection :title="$t('sonder@inventory.label')">
		<template #header>
			<button
				class="flex"
				@click="openModal"
			>
				<ion-icon
					class="text-2xl"
					:icon="add"
				/>
			</button>
		</template>
		<ion-list v-if="character.inventory?.length">
			<ion-reorder-group
				:disabled="false"
				@ion-item-reorder="handleReorder"
			>
				<Item
					v-for="(item, index) in character.inventory"
					:key="item.name"
					:item="item"
					:is-last="index === character.inventory.length - 1"
					@update="newItem => updateItem(newItem, index)"
					@remove="removeItem(index)"
				/>
			</ion-reorder-group>
		</ion-list>
		<p
			v-else
			class="min-h-13 flex items-center justify-center text-xl my-6"
		>
			{{ $t('sonder@inventory.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@inventory.add-item')"
		>
			<ItemForm
				mode="create"
				@save="onAdd"
			/>
		</ModalWindow>
	</SheetSection>
</template>
