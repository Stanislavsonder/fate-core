<script setup lang="ts">
import { Character } from '@/types'
import { computed, useId } from 'vue'
import AvatarPlaceholderDark from '@/assets/avatar-placeholder-dark.png'
import AvatarPlaceholderLight from '@/assets/avatar-placeholder-light.png'
import useTheme from '@/composables/useTheme'
import { downloadOutline, ellipsisVertical, settings } from 'ionicons/icons'
import {
	IonIcon,
	IonChip,
	IonCard,
	IonCardTitle,
	IonCardHeader,
	IonCardContent,
	IonCardSubtitle,
	IonPopover,
	IonButton,
	IonContent,
	IonList,
	IonItem,
	IonLabel
} from '@ionic/vue'
import { confirmRemove } from '@/utils/helpers/dialog'
import CharacterService from '@/service/character.service'
import { ROUTES } from '@/router'

const { character } = defineProps<{
	character: Character
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
	<ion-card>
		<img
			class="aspect-square object-cover w-full"
			alt="Silhouette of mountains"
			:src="character.avatar || placeholder"
		/>
		<div
			class="absolute end-1 top-1 size-8 rounded-full"
			:style="{ background: 'var(--ion-item-background)' }"
		>
			<ion-button
				:id="popoverId"
				class="absolute translate-x-[-18%] translate-y-[-5%] z-10"
				color="dark"
				size="small"
				fill="clear"
			>
				<ion-icon :icon="ellipsisVertical" />
			</ion-button>
		</div>

		<ion-card-header>
			<ion-card-title>
				{{ character.name }}
			</ion-card-title>
			<ion-card-subtitle>
				{{ character.race }}
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content>
			<ion-label>
				<template v-if="Object.keys(character._modules).length">
					<p class="!text-lg">
						{{ $t('modules.installed', { value: Object.keys(character._modules).length }) }}
					</p>
					<ion-chip
						v-for="m in Object.entries(character._modules)"
						:key="m[0]"
						class="pointer-events-none"
					>
						<ion-label>
							{{ `${$t(m[0] + '.name')} (${m[1].version})` }}
							{{ m[1].config && Object.keys(m[1].config).length ? '*' : '' }}
						</ion-label>
					</ion-chip>
				</template>
			</ion-label>
			<ion-button
				fill="clear"
				expand="block"
				@click="emit('select', character.id)"
			>
				{{ $t('common.actions.select') }}
			</ion-button>
		</ion-card-content>
		<ion-popover
			:trigger="popoverId"
			dismiss-on-select
		>
			<ion-content>
				<ion-list>
					<ion-item
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
	</ion-card>
</template>
