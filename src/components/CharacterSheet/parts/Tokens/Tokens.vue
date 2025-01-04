<template>
	<SheetSection :title="$t('sections.tokens')">
		<ul
			v-if="tokens?.length"
			class="flex flex-wrap gap-4 justify-center my-6"
		>
			<li
				v-for="id in tokens"
				:key="id"
			>
				<ion-icon
					:icon="TOKEN_ICON"
					class="text-5xl"
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
				@click="addToken"
			>
				<ion-icon
					class="text-2xl"
					:icon="add"
				/>
				{{ $t('actions.add') }}
			</Button>
			<Button
				class="grow"
				@click="useToken"
			>
				<ion-icon
					class="text-2xl"
					:icon="remove"
				/>
				{{ $t('actions.use') }}
			</Button>
		</div>
	</SheetSection>
</template>

<script setup lang="ts">
import { Character } from '@/types'
import SheetSection from '../../../ui/SheetSection.vue'
import Button from '../../../ui/Button.vue'
import { MAX_TOKENS, TOKEN_ICON } from '@/constants'
import { computed } from 'vue'
import { add, remove } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'

const character = defineModel<Character>({
	required: true
})

const tokens = computed<number[]>(() =>
	Array.from({
		length: character.value.tokens.current
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	}).map(_ => Math.random())
)

function addToken() {
	character.value.tokens.current = Math.min(MAX_TOKENS, character.value.tokens.current + 1)
}

function useToken() {
	character.value.tokens.current = Math.max(0, character.value.tokens.current - 1)
}
</script>
