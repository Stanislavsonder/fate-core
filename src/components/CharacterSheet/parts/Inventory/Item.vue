<script setup lang="ts">
import { IonItem, IonLabel, IonReorder, IonIcon, IonChip } from '@ionic/vue'
import itemIcons from '@/assets/icons/items'
import { type Item } from '@/types'
import ItemForm from '@/components/CharacterSheet/parts/Inventory/ItemForm.vue'
import { computed, nextTick, ref } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { formatQuantity } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { item } = defineProps<{
	item: Item
}>()

const emit = defineEmits<{
	update: [item: Item]
	remove: []
}>()

const isModalOpen = ref<boolean>(false)
const quantity = computed(() => formatQuantity(item.quantity, t))

function remove() {
	isModalOpen.value = false

	nextTick(() => {
		emit('remove')
	})
}

function save(newItem: Item) {
	emit('update', newItem)
	isModalOpen.value = false
}
</script>

<template>
	<ion-item
		button
		:detail="false"
		:aria-label="$t('a11y.edit-item', { value: item.name })"
		@click="isModalOpen = true"
	>
		<ion-icon
			v-if="item.icon"
			slot="start"
			class="text-3xl"
			:style="{ color: item.iconColor }"
			:icon="itemIcons[item.icon]"
			:aria-label="$t('a11y.icon', { value: item.icon })"
		/>
		<ion-label>
			<h6 class="!text-lg">{{ item.name }}</h6>
			<p>{{ item.description }}</p>
		</ion-label>
		<ion-chip
			v-if="item.quantity && item.quantity !== 1"
			slot="end"
			:aria-label="$t('a11y.quantity')"
		>
			{{ quantity }}
		</ion-chip>
		<ion-reorder
			slot="end"
			:aria-hidden="true"
		/>
	</ion-item>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('inventory.edit-item')"
		sheet
	>
		<ItemForm
			:item="item"
			mode="edit"
			@save="save"
			@remove="remove"
		/>
	</ModalWindow>
</template>
