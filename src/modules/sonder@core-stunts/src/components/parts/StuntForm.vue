<script setup lang="ts">
import type { FateContext } from '@/types'
import type { Stunt } from '../../types'
import type { Skill } from '@/modules/sonder@core-skills/src/types'
import { computed, inject, type Ref, ref } from 'vue'
import { clone } from '@/utils/helpers/clone'
import { confirmRemove } from '@/utils/helpers/dialog'
import { validateStunt } from '@/modules/sonder@core-stunts/src/utils/validators'
import { IonButton, IonInput, IonItem, IonList, IonNote, IonSelect, IonTextarea, IonSelectOption } from '@ionic/vue'
import { useI18n } from 'vue-i18n'

const { stunt: stuntInit } = defineProps<{
	mode: 'create' | 'edit'
	stunt?: Stunt
}>()

const emit = defineEmits<{
	save: [stunt: Stunt]
	remove: []
}>()

const { t } = useI18n()
const context = inject<Ref<FateContext>>('context')!
const SKILLS = context.value.shared['sonder@core-skills']?.skills || new Map()

const stunt = ref<Stunt>(stuntInit ? clone(stuntInit) : clone(context.value.templates.stunt!))

const sortedSkillList = computed<Skill[]>(() => {
	return [...SKILLS.values()].toSorted((a, b) => t(a.name).localeCompare(t(b.name)))
})

const validationError = computed<string | undefined>(() =>
	validateStunt(stunt.value, {
		MAX_STUNT_PRICE: context.value.constants.MAX_STUNT_PRICE!
	})
)

function save() {
	emit('save', clone(stunt.value))
}

async function remove() {
	if (await confirmRemove(stuntInit?.name)) {
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
						v-model="stunt.name"
						enterkeyhint="next"
						label-placement="fixed"
						:label="$t('forms.name')"
						:placeholder="$t('forms.name')"
						required
					/>
				</ion-item>
				<ion-item>
					<ion-input
						v-model.number="stunt.priceInTokens"
						inputmode="numeric"
						type="number"
						enterkeyhint="next"
						min="0"
						:max="context.constants.MAX_STUNT_PRICE"
						step="1"
						:maxlength="context.constants.MAX_STUNT_PRICE!.toString().length"
						:minlength="1"
						label-placement="fixed"
						:label="$t('forms.price')"
						:placeholder="$t('forms.price')"
					/>
				</ion-item>
				<ion-item>
					<ion-select
						v-model="stunt.skillId"
						label-placement="fixed"
						justify="start"
						:placeholder="$t('forms.skill')"
						:label="$t('forms.skill')"
					>
						<ion-select-option
							v-for="skill in sortedSkillList"
							:key="skill.id"
							:value="skill.id"
						>
							{{ $t(skill.name) }}
						</ion-select-option>
					</ion-select>
				</ion-item>
				<ion-item>
					<ion-textarea
						v-model="stunt.description"
						auto-grow
						label-placement="fixed"
						enterkeyhint="done"
						:label="$t('forms.description')"
						:placeholder="$t('forms.description')"
						:rows="5"
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
