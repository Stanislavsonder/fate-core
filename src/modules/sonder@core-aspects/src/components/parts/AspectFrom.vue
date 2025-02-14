<script setup lang="ts">
import type { FateContext } from '@/types'
import { computed, inject, type Ref, ref } from 'vue'
import { clone } from '@/utils/helpers/clone'
import { confirmRemove } from '@/utils/helpers/dialog'
import { validateCharacterAspect } from '../../utils/validators'
import { IonItem, IonList, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonNote, IonIcon } from '@ionic/vue'
import type { CharacterAspect } from '../../types'
import { CharacterAspectType } from '../../types'

const { aspect } = defineProps<{
	aspect?: CharacterAspect
	mode?: 'edit' | 'create'
}>()

const emit = defineEmits<{
	remove: []
	save: [aspect: CharacterAspect]
}>()

const context = inject<Ref<FateContext>>('context')!

const newAspect = ref<CharacterAspect>(aspect ? clone(aspect) : clone(context.value.templates.aspect))

const validationError = computed<string | undefined>(() => validateCharacterAspect(newAspect.value))

function save() {
	emit('save', newAspect.value)
}

async function remove() {
	if (await confirmRemove(aspect?.name)) {
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
						v-model="newAspect.name"
						data-testid="aspect-name-input"
						inputmode="text"
						:placeholder="$t('forms.name')"
						label-placement="fixed"
						enterkeyhint="next"
						:label="$t('forms.name')"
						required
					/>
				</ion-item>
				<ion-item>
					<ion-textarea
						v-model="newAspect.description"
						data-testid="aspect-description-input"
						:placeholder="$t('forms.description')"
						inputmode="text"
						auto-grow
						label-placement="fixed"
						:label="$t('forms.description')"
						:rows="5"
					/>
				</ion-item>
				<ion-item>
					<ion-select
						v-model="newAspect.type"
						data-testid="aspect-type-select"
						label-placement="fixed"
						justify="start"
						:placeholder="$t('forms.type')"
						:label="$t('forms.type')"
					>
						<ion-select-option
							v-for="type in CharacterAspectType"
							:key="type"
							:data-testid="`aspect-type-option-${type}`"
							:value="type"
						>
							{{ $t(`sonder@core-aspects.type.${type}.name`) }}
						</ion-select-option>
					</ion-select>
					<ion-icon
						v-if="context.constants.ASPECT_ICONS[newAspect.type]"
						slot="end"
						aria-hidden="true"
						:icon="context.constants.ASPECT_ICONS[newAspect.type] || undefined"
					/>
				</ion-item>
			</ion-list>
			<Transition name="fade-in">
				<ion-note
					data-testid="aspect-validation-error"
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
				data-testid="remove-aspect-button"
				color="danger"
				expand="full"
				fill="clear"
				@click="remove"
			>
				{{ $t(`common.actions.remove`) }}
			</ion-button>
			<ion-button
				data-testid="save-aspect-button"
				expand="block"
				:disabled="!!validationError"
				@click="save"
			>
				{{ $t(`common.actions.${mode === 'edit' ? 'save' : 'add'}`) }}
			</ion-button>
		</div>
	</div>
</template>
