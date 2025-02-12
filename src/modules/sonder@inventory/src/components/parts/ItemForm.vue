<script setup lang="ts">
import type { Item } from '../../types'
import { clone } from '@/utils/helpers/clone'
import { confirmRemove } from '@/utils/helpers/dialog'
import type { Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import IconSelect from './IconSelect.vue'
import { IonList, IonItem, IonTextarea, IonInput, IonButton, IonNote } from '@ionic/vue'
import { validateItem } from '../../utils/validators'
import ColorSelect from './ColorSelect.vue'
import type { FateContext } from '@/types'

const emit = defineEmits<{
	save: [item: Item]
	remove: []
}>()

const { item } = defineProps<{
	item?: Item
	mode?: 'edit' | 'create'
}>()

const context = inject<Ref<FateContext>>('context')!

const newItem = ref<Item>(item ? clone(item) : clone(context.value.templates.item!))

const validationError = computed<string | undefined>(() =>
	validateItem(newItem.value, {
		MAX_ITEM_QUANTITY: context.value.constants.MAX_ITEM_QUANTITY!
	})
)

function save() {
	if (!validationError.value) {
		emit('save', clone(newItem.value))
		return
	}
}

async function remove() {
	if (await confirmRemove(item?.name)) {
		emit('remove')
	}
}
</script>

<template>
	<div class="flex flex-col justify-between h-full">
		<div>
			<ion-list inset>
				<ion-item>
					<ion-input
						v-model="newItem.name"
						type="text"
						label-placement="fixed"
						enterkeyhint="next"
						inputmode="text"
						:label="$t('forms.name')"
						:placeholder="$t('forms.name')"
						required
					/>
				</ion-item>
				<ion-item>
					<ion-input
						v-model.number="newItem.quantity"
						type="number"
						enterkeyhint="next"
						min="1"
						step="1"
						:max="context.constants.MAX_ITEM_QUANTITY"
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
						enterkeyhint="done"
						:label="$t('forms.description')"
						:placeholder="$t('forms.description')"
						:rows="5"
					/>
				</ion-item>
				<ion-item>
					<ColorSelect v-model="newItem.iconColor" />
				</ion-item>
				<ion-item lines="none">
					<IconSelect
						v-model="newItem.icon"
						:color="newItem.iconColor"
					/>
				</ion-item>
			</ion-list>
			<Transition name="fade-in">
				<ion-note
					:aria-label="$t('a11y.validation-error')"
					class="px-4 block text-center min-h-5"
					color="danger"
				>
					<template v-if="validationError">
						{{ validationError }}
					</template>
				</ion-note>
			</Transition>
		</div>

		<div class="w-full p-4">
			<ion-button
				v-if="mode === 'edit'"
				color="danger"
				expand="full"
				fill="clear"
				@click="remove"
			>
				{{ $t(`common.actions.remove`) }}
			</ion-button>
			<ion-button
				expand="block"
				:disabled="!!validationError"
				@click="save"
			>
				{{ $t(`common.actions.${mode === 'edit' ? 'save' : 'add'}`) }}
			</ion-button>
		</div>
	</div>
</template>
