<script setup lang="ts">
import { CharacterAspect, CharacterAspectType } from '@/types'
import { computed, ref } from 'vue'
import { clone } from '@/utils'
import { validateCharacterAspect, ValidationResult } from '@/validators'
import { IonItem, IonList, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonNote, IonIcon } from '@ionic/vue'
import { ASPECT_ICONS } from '@/constants.js'

const { aspect } = defineProps<{
	aspect?: CharacterAspect
	mode?: 'edit' | 'create'
}>()

const emit = defineEmits<{
	remove: []
	save: [aspect: CharacterAspect]
}>()

const newAspect = ref<CharacterAspect>(
	aspect
		? clone(aspect)
		: {
				name: '',
				description: '',
				type: CharacterAspectType.Other
			}
)

const validationError = computed<ValidationResult>(() => validateCharacterAspect(newAspect.value))

function save() {
	emit('save', newAspect.value)
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
						v-model="newAspect.name"
						type="text"
						inputmode="text"
						:placeholder="$t('forms.name')"
						label-placement="fixed"
						enterkeyhint="done"
						:label="$t('forms.name')"
						required
					/>
				</ion-item>
				<ion-item>
					<ion-select
						v-model="newAspect.type"
						label-placement="fixed"
						justify="start"
						:placeholder="$t('forms.type')"
						:label="$t('forms.type')"
					>
						<ion-select-option
							v-for="type in CharacterAspectType"
							:key="type"
							:value="type"
						>
							{{ $t(`aspects.type.${type}.name`) }}
						</ion-select-option>
					</ion-select>
					<ion-icon
						v-if="ASPECT_ICONS[newAspect.type]"
						slot="end"
						aria-hidden="true"
						:icon="ASPECT_ICONS[newAspect.type] || undefined"
					/>
				</ion-item>
				<ion-item>
					<ion-textarea
						v-model="newAspect.description"
						:placeholder="$t('forms.description')"
						enterkeyhint="done"
						inputmode="text"
						auto-grow
						label-placement="fixed"
						:label="$t('forms.description')"
						:rows="5"
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
				<p v-else></p>
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
