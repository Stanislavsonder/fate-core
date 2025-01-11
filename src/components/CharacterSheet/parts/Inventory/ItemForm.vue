<script setup lang="ts">
import { Item } from '@/types'
import { EMPTY_ITEM, MAX_ITEM_QUANTITY } from '@/constants'
import { clone } from '@/utils'
import { computed, ref } from 'vue'
import IconSelect from '@/components/CharacterSheet/parts/Inventory/IconSelect.vue'
import { IonList, IonItem, IonTextarea, IonInput, IonButton, IonNote } from '@ionic/vue'
import { validateItem, ValidationResult } from '@/validators'

const emit = defineEmits<{
	save: [item: Item]
	remove: []
}>()

const { item } = defineProps<{
	item?: Item
	mode?: 'edit' | 'create'
}>()

const newItem = ref<Item>(item ? clone(item) : structuredClone(EMPTY_ITEM))

const validationError = computed<ValidationResult>(() => validateItem(newItem.value))

function save() {
	if (!validationError.value) {
		emit('save', clone(newItem.value))
		return
	}
}

function remove() {
	emit('remove')
}
</script>

<template>
	<form
		class="flex flex-col justify-between h-full"
		@submit.prevent="save"
	>
		<div>
			<ion-list inset>
				<ion-item>
					<ion-input
						v-model="newItem.name"
						type="text"
						label-placement="fixed"
						:label="$t('forms.name')"
						:placeholder="$t('forms.name')"
						required
					/>
				</ion-item>
				<ion-item>
					<ion-input
						v-model.number="newItem.quantity"
						type="number"
						min="1"
						step="1"
						:max="MAX_ITEM_QUANTITY"
						inputmode="numeric"
						label-placement="fixed"
						:label="$t('forms.quantity')"
						:placeholder="$t('forms.quantity')"
					/>
				</ion-item>
				<ion-item>
					<ion-textarea
						v-model="newItem.description"
						auto-grow
						label-placement="fixed"
						:label="$t('forms.description')"
						:placeholder="$t('forms.description')"
						:rows="5"
					/>
				</ion-item>
				<ion-item lines="none">
					<IconSelect
						v-model="newItem.icon"
						v-model:color="newItem.iconColor"
					/>
				</ion-item>
			</ion-list>
			<Transition name="fade-in">
				<ion-note
					v-if="validationError"
					:aria-label="$t('a11y.validation-error')"
					class="px-4 block text-center"
					color="danger"
				>
					{{ Array.isArray(validationError) ? $t(...validationError) : $t(validationError) }}
				</ion-note>
			</Transition>
		</div>

		<div class="w-full p-4">
			<ion-button
				v-if="mode === 'edit'"
				color="danger"
				expand="full"
				fill="clear"
				@click.prevent="remove"
			>
				{{ $t(`common.actions.remove`) }}
			</ion-button>
			<ion-button
				expand="block"
				:disabled="!!validationError"
				type="submit"
			>
				{{ $t(`common.actions.${mode === 'edit' ? 'save' : 'add'}`) }}
			</ion-button>
		</div>
	</form>
</template>
