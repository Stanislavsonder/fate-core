<script setup lang="ts">
import { Inventory, Item as ItemType } from '@/types'
import SheetSection from '@/components/ui/SheetSection.vue'
import { IonIcon, IonList, IonReorderGroup } from '@ionic/vue'
import Item from '@/components/CharacterSheet/parts/Inventory/Item.vue'
import { add } from 'ionicons/icons'
import { ref } from 'vue'
import ItemForm from '@/components/CharacterSheet/parts/Inventory/ItemForm.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'

const isModalOpen = ref<boolean>(false)
const inventory = defineModel<Inventory>({
	required: true,
	default: () => []
})

function handleReorder(event: CustomEvent) {
	const fromIndex = event.detail.from
	const toIndex = event.detail.to
	const movedItem = inventory.value.splice(fromIndex, 1)[0]
	inventory.value.splice(toIndex, 0, movedItem)
	event.detail.complete()
}

function openModal() {
	isModalOpen.value = true
}

function onAdd(item: ItemType) {
	inventory.value.push(item)
	isModalOpen.value = false
}

function updateItem(item: ItemType, index: number) {
	inventory.value[index] = item
}

function removeItem(index: number) {
	inventory.value.splice(index, 1)
}
</script>

<template>
	<SheetSection :title="$t('inventory.label')">
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
		<ion-list v-if="inventory?.length">
			<ion-reorder-group
				:disabled="false"
				@ion-item-reorder="handleReorder($event)"
			>
				<Item
					v-for="(item, index) in inventory"
					:key="item.name"
					:item="item"
					@update="newItem => updateItem(newItem, index)"
					@remove="removeItem(index)"
				/>
			</ion-reorder-group>
		</ion-list>
		<p
			v-else
			class="min-h-13 flex items-center justify-center text-xl my-6"
		>
			{{ $t('inventory.empty') }}
		</p>
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('inventory.add-item')"
		>
			<ItemForm
				mode="create"
				@save="onAdd"
			/>
		</ModalWindow>
	</SheetSection>
</template>
