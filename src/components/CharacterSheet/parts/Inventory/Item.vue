<script setup lang="ts">
import { IonItem, IonLabel, IonReorder, IonIcon, IonChip } from '@ionic/vue'
import itemIcons from '@/assets/icons/items'
import { type Item } from '@/types'
import ItemForm from '@/components/CharacterSheet/parts/Inventory/ItemForm.vue'
import { computed, shallowRef } from 'vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { formatCount } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { item } = defineProps<{
	item: Item
}>()

const emit = defineEmits<{
	update: [item: Item]
	remove: []
}>()

const isModalOpen = shallowRef<boolean>(false)
const count = computed(() => formatCount(item.count, t))

function remove() {
	emit('remove')
	isModalOpen.value = false
}

function save(newItem: Item) {
	emit('update', newItem)
	isModalOpen.value = false
}
</script>

<template>
	<ion-item @click="isModalOpen = true">
		<ion-icon
			v-if="item.icon"
			slot="start"
			class="text-3xl"
			:style="{ color: item.iconColor }"
			:icon="itemIcons[item.icon]"
		/>
		<ion-label>
			<h6 class="!text-lg">{{ item.name }}</h6>
			<p>{{ item.description }}</p>
		</ion-label>
		<ion-chip
			v-if="item.count && item.count !== 1"
			slot="end"
		>
			{{ count }}
		</ion-chip>
		<ion-reorder slot="end" />
	</ion-item>
	<ModalWindow
		v-model="isModalOpen"
		:title="$t('inventory.edit-item')"
	>
		<ItemForm
			:item="item"
			mode="edit"
			@save="save"
			@remove="remove"
		/>
	</ModalWindow>
</template>
