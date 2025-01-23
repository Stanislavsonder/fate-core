<script setup lang="ts">
import { Character } from '@/types'
import SheetSection from '../../../ui/SheetSection.vue'
import Button from '../../../ui/Button.vue'
import { add, remove } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import useFate from '@/store/useFate'

const character = defineModel<Character>({
	required: true
})

const { constants } = useFate()

function addToken() {
	character.value.tokens = Math.min(constants.MAX_TOKENS, character.value.tokens + 1)
}

function useToken() {
	character.value.tokens = Math.max(0, character.value.tokens - 1)
}
</script>

<template>
	<SheetSection :title="$t('sections.tokens')">
		<span
			v-if="character.tokens"
			class="sr-only"
		>
			{{ $t('a11y.available-tokens', { value: character.tokens }) }}
		</span>
		<ul
			v-if="character.tokens"
			class="flex flex-wrap gap-4 justify-center my-6"
			aria-hidden="true"
		>
			<li
				v-for="id in character.tokens"
				:key="id"
			>
				<ion-icon
					:icon="constants.TOKEN_ICON"
					class="text-5xl"
					aria-hidden="true"
				/>
			</li>
		</ul>
		<p
			v-else
			class="min-h-13 flex items-center justify-center text-xl my-6"
		>
			{{ $t('tokens.no-available') }}
		</p>
		<div class="flex flex-wrap gap-2 p-4 justify-around">
			<Button
				class="grow"
				:disabled="character.tokens >= constants.MAX_TOKENS"
				@click="addToken"
			>
				<ion-icon
					class="text-2xl"
					:icon="add"
					aria-hidden="true"
				/>
				{{ $t('common.actions.add') }}
			</Button>
			<Button
				class="grow"
				:disabled="!character.tokens"
				@click="useToken"
			>
				<ion-icon
					class="text-2xl"
					:icon="remove"
					aria-hidden="true"
				/>
				{{ $t('common.actions.use') }}
			</Button>
		</div>
	</SheetSection>
</template>
