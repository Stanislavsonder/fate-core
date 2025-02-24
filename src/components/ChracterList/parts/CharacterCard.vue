<script setup lang="ts">
import type { Character } from '@/types'
import { computed, useId } from 'vue'
import AvatarPlaceholderDark from '@/assets/avatar-placeholder-dark.png'
import AvatarPlaceholderLight from '@/assets/avatar-placeholder-light.png'
import useTheme from '@/composables/useTheme'
import { downloadOutline, ellipsisVertical, settings } from 'ionicons/icons'
import { IonIcon, IonPopover, IonButton, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue'
import { confirmRemove } from '@/utils/helpers/dialog'
import CharacterService from '@/service/character.service'
import { ROUTES } from '@/router'

const { character } = defineProps<{
	character: Character
	isSelected: boolean
}>()

const emit = defineEmits<{
	select: [id: number]
	remove: [id: number]
	configure: [id: number]
}>()

const popoverId = useId()
const { isDarkMode } = useTheme()

const placeholder = computed<string>(() => (isDarkMode.value ? AvatarPlaceholderDark : AvatarPlaceholderLight))

async function remove() {
	if (await confirmRemove(character.name)) {
		emit('remove', character.id)
	}
}
</script>

<template>
	<section class="grid grid-cols-2 bg-background-2 rounded-xl relative">
		<img
			class="aspect-square object-cover w-full rounded-xl rounded-bl-none rounded-tr-none"
			:alt="character.name"
			:src="character.avatar || placeholder"
		/>
		<div class="p-2">
			<h3 class="font-bold mb-2 pe-8">{{ character.name }}</h3>
			<h4 class="text-sm mb-4 opacity-70">{{ character.race }}</h4>

			<h4 class="text-xs mb-2 opacity-70">
				{{ $t('modules.installed', { value: Object.keys(character._modules).length }) }}
			</h4>

			<ul class="grid gap-1">
				<li
					v-for="m in Object.entries(character._modules)"
					:key="m[0]"
					class="flex text-xs p-1 px-2 bg-background-3 text-light justify-between rounded"
				>
					<span>{{ $t(m[0] + '.name') }}</span>
					<span>
						{{ m[1].config && Object.keys(m[1].config).length ? '*' : '' }}
						{{ `${m[1].version}` }}
					</span>
				</li>
			</ul>
		</div>
		<div
			class="absolute end-1 top-1 size-8 rounded-full"
			:style="{ background: 'var(--ion-item-background)' }"
		>
			<ion-button
				:id="popoverId"
				data-testid="character-popover"
				:data-testname="character.name"
				class="absolute translate-x-[-18%] translate-y-[-5%] z-10"
				color="dark"
				size="small"
				fill="clear"
			>
				<ion-icon :icon="ellipsisVertical" />
			</ion-button>
		</div>
		<ion-button
			data-testid="character-select"
			:data-testname="character.name"
			:disabled="isSelected"
			class="col-span-2"
			fill="clear"
			expand="block"
			@click="emit('select', character.id)"
		>
			{{ $t('common.actions.select') }}
		</ion-button>
		<ion-popover
			:trigger="popoverId"
			dismiss-on-select
		>
			<ion-content>
				<ion-list>
					<ion-item
						data-testid="character-configure"
						button
						:detail="false"
						:router-link="ROUTES.CHARACTER_CONFIGURE.replace(':id', character.id.toString())"
					>
						{{ $t('character.configure') }}
						<ion-icon
							slot="end"
							:aria-hidden="true"
							:icon="settings"
						/>
					</ion-item>
					<ion-item
						:detail="false"
						button
						@click="CharacterService.exportCharacter(character)"
					>
						{{ $t('character.export') }}
						<ion-icon
							slot="end"
							:aria-hidden="true"
							:icon="downloadOutline"
						/>
					</ion-item>
					<ion-item
						:detail="false"
						button
						@click="CharacterService.exportModules(character)"
					>
						{{ $t('modules.export') }}
						<ion-icon
							slot="end"
							:aria-hidden="true"
							:icon="downloadOutline"
						/>
					</ion-item>
					<ion-item
						lines="none"
						button
						:detail="false"
						@click="remove"
					>
						<ion-label color="danger">
							{{ $t('common.actions.delete') }}
						</ion-label>
					</ion-item>
				</ion-list>
			</ion-content>
		</ion-popover>
	</section>
</template>
