<script setup lang="ts">
import { Stunt } from '@/types'
import { BASE_SKILLS, EMPTY_STUNT, MAX_STUNT_PRICE } from '@/utils/constants'
import { computed, ref } from 'vue'
import { clone, confirmRemove } from '@/utils'
import { validateStunt } from '@/utils/validators'
import { IonButton, IonInput, IonItem, IonList, IonNote, IonSelect, IonTextarea } from '@ionic/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { stunt: stuntInit } = defineProps<{
	mode: 'create' | 'edit'
	stunt?: Stunt
}>()

const emit = defineEmits<{
	save: [stunt: Stunt]
	remove: []
}>()

const stunt = ref<Stunt>(stuntInit ? clone(stuntInit) : structuredClone(EMPTY_STUNT))

const sortedSkillList = computed<string[]>(() => {
	const skills = Object.keys(BASE_SKILLS)
	return skills.sort((a, b) => t(`skills.list.${a}.name`).localeCompare(t(`skills.list.${b}.name`)))
})

const validationError = computed<string | undefined>(() => validateStunt(stunt.value))

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
	<form
		class="flex flex-col justify-between h-full"
		@submit.prevent="save"
	>
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
						enterkeyhint="next"
						min="0"
						:max="MAX_STUNT_PRICE"
						step="1"
						:maxlength="MAX_STUNT_PRICE.toString().length"
						:minlength="1"
						label-placement="fixed"
						:label="$t('forms.price')"
						:placeholder="$t('forms.price')"
					/>
				</ion-item>
				<ion-item>
					<ion-select
						v-model="stunt.skill"
						label-placement="fixed"
						justify="start"
						:placeholder="$t('forms.skill')"
						:label="$t('forms.skill')"
					>
						<ion-select-option
							v-for="skill in sortedSkillList"
							:key="skill"
							:value="skill"
						>
							{{ $t(`skills.list.${skill}.name`) }}
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
