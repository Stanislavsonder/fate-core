<script setup lang="ts">
import { CharacterAspect, CharacterAspectType } from '@/types'
import { computed, ref } from 'vue'
import { clone, confirmRemove } from '@/utils'
import { validateCharacterAspect } from '@/utils/validators'
import { IonItem, IonList, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonNote, IonIcon } from '@ionic/vue'
import useFate from '@/store/useFate'

const { aspect } = defineProps<{
	aspect?: CharacterAspect
	mode?: 'edit' | 'create'
}>()

const emit = defineEmits<{
	remove: []
	save: [aspect: CharacterAspect]
}>()

const { constants, templates } = useFate()

const newAspect = ref<CharacterAspect>(aspect ? clone(aspect) : clone(templates.aspect))

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
						v-if="constants.ASPECT_ICONS[newAspect.type]"
						slot="end"
						aria-hidden="true"
						:icon="constants.ASPECT_ICONS[newAspect.type] || undefined"
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
