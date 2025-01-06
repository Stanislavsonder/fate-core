<script setup lang="ts">
import { Item } from '@/types'
import { EMPTY_ITEM, MAX_ITEM_COUNT } from '@/constants'
import { clone } from '@/utils'
import { ref } from 'vue'
import IconSelect from '@/components/CharacterSheet/parts/Inventory/IconSelect.vue'
import Button from '@/components/ui/Button.vue'
import { validateItem } from '@/validators'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
	save: [item: Item]
	remove: []
}>()

const { item } = defineProps<{
	item?: Item
	mode?: 'edit' | 'create'
}>()

const newItem = ref<Item>(item ? clone(item) : structuredClone(EMPTY_ITEM))

function save() {
	const error = validateItem(newItem.value)

	if (error) {
		if (Array.isArray(error)) {
			alert(t(...error))
		} else {
			alert(t(error))
		}
		return
	}

	emit('save', clone(newItem.value))
}
</script>

<template>
	<form
		class="flex flex-col gap-4"
		@submit.prevent="save"
	>
		<input
			v-model="newItem.name"
			type="text"
			class="w-full border-1 rounded p-2"
			:placeholder="$t('inventory.form.name.placeholder')"
		/>
		<input
			v-model.number="newItem.count"
			type="number"
			min="1"
			step="1"
			:max="MAX_ITEM_COUNT"
			inputmode="numeric"
			class="w-full border-1 rounded p-2"
			:placeholder="$t('inventory.form.count.placeholder')"
		/>
		<textarea
			v-model="newItem.description"
			:placeholder="$t('inventory.form.description.placeholder')"
			cols="30"
			rows="10"
			class="w-full border-1 rounded p-2 min-h-10"
		/>

		<IconSelect
			v-model="newItem.icon"
			v-model:color="newItem.iconColor"
		/>
		<div class="flex gap-4">
			<Button
				v-if="mode === 'edit'"
				class="grow bg-danger"
				@click.prevent="emit('remove')"
			>
				{{ $t(`common.actions.remove`) }}
			</Button>
			<Button class="grow">
				{{ $t(`common.actions.${mode === 'edit' ? 'save' : 'add'}`) }}
			</Button>
		</div>
	</form>
</template>
