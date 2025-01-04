<script setup lang="ts">
import ModalWindow from '../../../ui/ModalWindow.vue'
import { Stunt } from '@/types'
import Button from '../../../ui/Button.vue'
import { BASE_SKILLS, EMPTY_STUNT } from '@/constants'
import { ref, watch } from 'vue'
import { clone } from '@/utils'
import { useI18n } from 'vue-i18n'
import { validateStunt } from '@/validators'

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

const isOpen = defineModel<boolean>({
	default: false
})

watch(isOpen, value => {
	if (!value) {
		stunt.value = structuredClone(EMPTY_STUNT)
	}
})

function save() {
	const error = validateStunt(stunt.value)

	if (error) {
		alert(t(error))
		return
	}
	emit('save', stunt.value)
}
</script>

<template>
	<ModalWindow
		v-model="isOpen"
		:title="$t(`stunts.${mode === 'edit' ? 'edit' : 'add-new'}`)"
	>
		<form
			class="flex flex-col gap-4"
			@submit.prevent="save"
		>
			<label>
				<span class="font-medium block mb-1">
					{{ $t('stunts.form.name.label') }}
				</span>
				<input
					v-model="stunt.name"
					type="text"
					class="w-full border-1 rounded p-2"
					:placeholder="$t('stunts.form.name.placeholder')"
				/>
			</label>
			<label>
				<span class="font-medium block mb-1">
					{{ $t('stunts.form.description.label') }}
				</span>
				<textarea
					v-model="stunt.description"
					:placeholder="$t('stunts.form.description.placeholder')"
					cols="30"
					rows="10"
					class="w-full border-1 rounded p-2 min-h-10"
				/>
			</label>

			<label>
				<span class="font-medium block mb-1">
					{{ $t('stunts.form.skill.label') }}
				</span>
				<select
					v-model="stunt.skill"
					class="w-full border-1 rounded p-2"
				>
					<option
						v-for="skill in Object.keys(BASE_SKILLS)"
						:key="skill"
						:value="skill"
					>
						{{ $t(`skills.${skill}.name`) }}
					</option>
				</select>
			</label>

			<label>
				<span class="font-medium block mb-1">
					{{ $t('stunts.form.price.label') }}
				</span>
				<input
					v-model="stunt.priceInTokens"
					type="number"
					inputmode="numeric"
					min="0"
					max="10"
					step="1"
					pattern="[0-9]*"
					class="w-full border-1 rounded p-2"
					:placeholder="$t('stunts.form.price.placeholder')"
				/>
			</label>

			<div class="flex gap-4">
				<Button
					v-if="mode === 'edit'"
					class="grow"
					@click.prevent="emit('remove')"
				>
					{{ $t('actions.remove') }}
				</Button>
				<Button class="grow">
					{{ $t(`actions.${mode === 'edit' ? 'save' : 'add'}`) }}
				</Button>
			</div>
		</form>
	</ModalWindow>
</template>
