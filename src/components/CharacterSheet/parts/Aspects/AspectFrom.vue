<script setup lang="ts">
import { CharacterAspect, CharacterAspectType } from '@/types'
import { ref } from 'vue'
import Button from '../../../ui/Button.vue'
import { clone } from '@/utils'
import { validateCharacterAspect } from '@/validators'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { aspect } = defineProps<{
	aspect?: CharacterAspect
	mode?: 'edit' | 'create'
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

const emit = defineEmits<{
	remove: []
	save: [aspect: CharacterAspect]
}>()

function save() {
	const error = validateCharacterAspect(newAspect.value)

	if (error) {
		alert(t(error))
		return
	}

	emit('save', newAspect.value)
}
</script>

<template>
	<form
		class="flex flex-col gap-4"
		@submit.prevent="save"
	>
		<input
			v-model="newAspect.name"
			type="text"
			class="w-full border-1 rounded p-2"
			:placeholder="$t('aspects.form.name.placeholder')"
		/>
		<textarea
			v-model="newAspect.description"
			:placeholder="$t('aspects.form.description.placeholder')"
			cols="30"
			rows="10"
			class="w-full border-1 rounded p-2 min-h-10"
		/>
		<select
			v-model="newAspect.type"
			class="w-full border-1 rounded p-2"
		>
			<option
				v-for="type in CharacterAspectType"
				:key="type"
				:value="type"
			>
				{{ $t(`aspects.type.${type}.name`) }}
			</option>
		</select>
		<div class="flex gap-4">
			<Button
				v-if="mode === 'edit'"
				class="grow"
				@click.prevent="emit('remove')"
			>
				{{ $t(`actions.remove`) }}
			</Button>
			<Button class="grow">
				{{ $t(`actions.${mode === 'edit' ? 'save' : 'add'}`) }}
			</Button>
		</div>
	</form>
</template>
