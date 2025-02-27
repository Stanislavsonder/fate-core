<script setup lang="ts">
import type { FateModuleConfigOption } from '@/modules/utils/types'
import { IonItem, IonLabel, IonButton, IonIcon, IonList, IonCard, IonCardHeader, IonCardContent } from '@ionic/vue'
import { add, trash } from 'ionicons/icons'
import ModuleConfigOption from './ModuleConfigOption.vue'

const props = defineProps<{
	option: FateModuleConfigOption
	isModified: boolean
}>()

const modelValue = defineModel<unknown[]>({
	required: true,
	default: () => []
})

function addCustomListItem() {
	const newItem: Record<string, unknown> = {}

	// Initialize with default values from item template
	if (props.option.itemTemplate?.fields) {
		props.option.itemTemplate.fields.forEach(field => {
			newItem[field.id] = field.default
		})
	}

	const newValue = [...(modelValue.value || []), newItem]
	modelValue.value = newValue
}

function removeCustomListItem(index: number) {
	const newValue = [...(modelValue.value || [])]
	newValue.splice(index, 1)
	modelValue.value = newValue
}

function updateCustomListItemField(itemIndex: number, fieldId: string, fieldValue: unknown) {
	const newValue = [...(modelValue.value || [])]
	const updatedItem = newValue[itemIndex] as Record<string, unknown>
	updatedItem[fieldId] = fieldValue
	newValue[itemIndex] = updatedItem
	modelValue.value = newValue
}
</script>

<template>
	<div>
		<ion-item lines="none">
			<ion-label :color="isModified ? 'warning' : undefined">
				{{ $t(option.name) }}
			</ion-label>
			<ion-button
				slot="end"
				fill="clear"
				@click="addCustomListItem"
			>
				<ion-icon :icon="add"></ion-icon>
				{{ $t('common.actions.add') }}
			</ion-button>
		</ion-item>
		<ion-list class="custom-list-items">
			<ion-card
				v-for="(item, itemIndex) in modelValue"
				:key="itemIndex"
			>
				<ion-card-header>
					<ion-button
						fill="clear"
						color="danger"
						@click="removeCustomListItem(itemIndex)"
					>
						<ion-icon :icon="trash"></ion-icon>
					</ion-button>
				</ion-card-header>

				<ion-card-content v-if="option.itemTemplate?.fields">
					<div
						v-for="(field, fieldIndex) in option.itemTemplate.fields"
						:key="fieldIndex"
					>
						<ModuleConfigOption
							:option="field"
							:value="(item as Record<string, unknown>)[field.id]"
							@change="(id, value) => updateCustomListItemField(itemIndex, id, value)"
						/>
					</div>
				</ion-card-content>
			</ion-card>
		</ion-list>

		<ion-item
			v-if="!modelValue.length"
			lines="none"
		>
			<ion-label color="medium">{{ $t('common.messages.emptyList') }}</ion-label>
		</ion-item>
	</div>
</template>
