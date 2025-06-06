<script setup lang="ts">
import { IonItem, IonLabel, IonReorder, IonIcon, IonChip } from '@ionic/vue'
import icons from '../../assets/icons'
import type { Item } from '../../types'
import ItemForm from './ItemForm.vue'
import { computed, nextTick, ref } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { formatQuantity } from '@/modules/sonder@inventory/src/utils/format'

const { item, isLast } = defineProps<{
	item: Item
	isLast: boolean
}>()

const emit = defineEmits<{
	update: [item: Item]
	remove: []
}>()

const isModalOpen = ref<boolean>(false)
const quantity = computed(() => formatQuantity(item.quantity))

function remove() {
	isModalOpen.value = false

	nextTick(() => {
		emit('remove')
	})
}

function save(newItem: Item) {
	isModalOpen.value = false
	nextTick(() => {
		emit('update', newItem)
	})
}
</script>

<template>
	<ion-item
		button
		:detail="false"
		:lines="!isLast ? 'full' : 'none'"
		:aria-label="$t('sonder@inventory.a11y.edit-item', { value: item.name })"
		@click="isModalOpen = true"
	>
		<ion-icon
			v-if="item.icon"
			slot="start"
			class="text-3xl"
			:style="{ color: item.iconColor }"
			:icon="icons[item.icon]"
			:aria-label="$t('sonder@inventory.a11y.icon', { value: item.icon })"
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
		<ModalWindow
			v-model="isModalOpen"
			:title="$t('sonder@inventory.edit-item')"
		>
			<ItemForm
				:item="item"
				mode="edit"
				@save="save"
				@remove="remove"
			/>
		</ModalWindow>
	</ion-item>
</template>
