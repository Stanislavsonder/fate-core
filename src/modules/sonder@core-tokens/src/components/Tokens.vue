<script setup lang="ts">
import type { Character, FateContext } from '@/types'
import SheetSection from '@/components/ui/SheetSection.vue'
import Button from '@/components/ui/Button.vue'
import { add, remove } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import { inject, type Ref } from 'vue'

const character = defineModel<Character>({
	required: true
})

const context = inject<Ref<FateContext>>('context')!

function addToken() {
	character.value.tokens = Math.min(context.value.constants.MAX_TOKENS!, character.value.tokens! + 1)
}

function useToken() {
	character.value.tokens = Math.max(0, character.value.tokens! - 1)
}
</script>

<template>
	<SheetSection :title="$t('sonder@core-tokens.label')">
		<span
			v-if="character.tokens"
			class="sr-only"
		>
			{{ $t('sonder@core-tokens.a11y.availableTokens', { value: character.tokens }) }}
		</span>
		<ul
			v-if="character.tokens"
			class="flex flex-wrap gap-4 justify-center my-6"
			aria-hidden="true"
		>
			<li
				v-for="id in character.tokens"
				:key="id"
				data-testid="token"
			>
				<ion-icon
					:icon="context.constants.TOKEN_ICON"
					class="text-5xl"
					aria-hidden="true"
				/>
			</li>
		</ul>
		<p
			v-else
			class="min-h-13 flex items-center justify-center text-xl my-6"
		>
			{{ $t('sonder@core-tokens.empty') }}
		</p>
		<div class="flex flex-wrap gap-2 p-4 justify-around">
			<Button
				data-testid="add-token"
				class="grow"
				:disabled="character.tokens! >= context.constants.MAX_TOKENS!"
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
				data-testid="use-token"
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
