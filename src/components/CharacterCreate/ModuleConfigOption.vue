<script setup lang="ts">
import type { FateModuleConfigOption } from '@/modules/utils/types'
import { IonToggle, IonInput, IonItem, IonSelect, IonSelectOption, IonRange, IonLabel } from '@ionic/vue'
import { computed } from 'vue'

const { option, value } = defineProps<{
	option: FateModuleConfigOption
	value: unknown
}>()

const emit = defineEmits<{
	change: [string, unknown]
}>()

const isModified = computed(() => {
	if (Array.isArray(value) && Array.isArray(option.default)) {
		return value.some((v, i) => v !== (option.default as unknown[])[i])
	}

	return value !== undefined && value !== option.default
})

function emitCheckbox() {
	emit('change', option.id, typeof value === 'boolean' ? !(value as boolean) : !option.default || false)
}

function emitNumber(event: CustomEvent) {
	try {
		const val = event.detail.value
		if (val && (typeof val === 'string' || typeof val === 'number')) {
			const parsedValue = parseFloat(val.toString())
			if (isNaN(parsedValue)) {
				return
			}
			emit('change', option.id, parsedValue)
		} else {
			emit('change', option.id, emit('change', option.id, option.default || 0))
		}
	} catch (e) {
		console.error(e)
		emit('change', option.id, option.default || 0)
		return
	}
}

function emitRange(event: CustomEvent) {
	const { lower, upper } = event.detail.value
	emit('change', option.id, [lower, upper])
}
</script>

<template>
	<ion-item
		v-if="option.type === 'boolean'"
		lines="none"
		@ion-change="emitCheckbox"
	>
		<ion-toggle
			data-testid="config-option-toggle"
			:data-testname="option.id"
			:label="$t(option.name)"
			:checked="typeof value === 'boolean' ? (value as boolean) : (option.default as boolean) || false"
		>
			<ion-label :color="isModified ? 'warning' : undefined">
				{{ $t(option.name) }}
			</ion-label>
		</ion-toggle>
	</ion-item>
	<ion-item
		v-else-if="option.type === 'string'"
		lines="none"
		@ion-change="(e: CustomEvent) => emit('change', option.id, e.detail.value)"
	>
		<ion-input
			data-testid="config-option-text"
			:data-testname="option.id"
			:helper-text="$t(option.tooltip || '')"
			label-placement="start"
			:value="(value as string) || (option.default as string) || ''"
			:maxlength="option.limits?.max"
			:minlength="option.limits?.min"
		>
			<ion-label
				slot="start"
				:color="isModified ? 'warning' : undefined"
			>
				{{ $t(option.name) }}
			</ion-label>
		</ion-input>
	</ion-item>
	<ion-item
		v-else-if="option.type === 'number'"
		lines="none"
		@ion-change="emitNumber"
	>
		<ion-input
			data-testid="config-option-number"
			:data-testname="option.id"
			type="number"
			inputmode="numeric"
			label-placement="start"
			:helper-text="$t(option.tooltip || '')"
			:min="option.limits?.min"
			:max="option.limits?.max"
			:step="option.limits?.step?.toString()"
			:value="typeof value === 'number' ? (value as number) : (option.default as number) || 0"
		>
			<ion-label
				slot="start"
				:color="isModified ? 'warning' : undefined"
			>
				{{ $t(option.name) }}
			</ion-label>
		</ion-input>
	</ion-item>
	<ion-item
		v-else-if="option.type === 'select'"
		lines="none"
		@ion-change="emit('change', option.id, $event.detail.value)"
	>
		<ion-select
			data-testid="config-option-select"
			:data-testname="option.id"
			:class="{ modified: isModified }"
			:label="$t(option.name)"
			interface="action-sheet"
			:value="value || option.default"
			:multiple="option.multiple"
		>
			<ion-select-option
				v-for="o in option.options"
				:key="o.value"
				data-testid="config-option-select-option"
				:data-testname="option.id"
				:value="o.value"
			>
				{{ $t(o.label) }}
			</ion-select-option>
		</ion-select>
	</ion-item>
	<ion-item
		v-else-if="option.type === 'range'"
		lines="none"
		@ion-change="emitRange"
	>
		<ion-range
			data-testid="config-option-range"
			:data-testname="option.id"
			dual-knobs
			pin
			ticks
			snaps
			:value="Array.isArray(value) ? { lower: value[0], upper: value[1] } : { lower: (option.default as number[])[0], upper: (option.default as number[])[1] }"
			:min="option.limits?.min"
			:max="option.limits?.max"
			:step="option.limits?.step"
		>
			<ion-label
				slot="start"
				:color="isModified ? 'warning' : undefined"
			>
				{{ $t(option.name) }}
			</ion-label>
		</ion-range>
	</ion-item>
</template>

<style scoped>
ion-select.modified::part(label) {
	color: var(--ion-color-warning);
}
</style>
