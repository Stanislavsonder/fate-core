<script setup lang="ts">
import { computed, inject, type Ref, ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import AvatarPlaceholderDark from '@/assets/avatar-placeholder-dark.png'
import AvatarPlaceholderLight from '@/assets/avatar-placeholder-light.png'
import { trash, image } from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/Button.vue'
import useTheme from '@/composables/useTheme'
import type { FateContext } from '@/types'

const { t } = useI18n()
const { isDarkMode } = useTheme()

const context = inject<Ref<FateContext>>('context')!

const fileInput = ref<HTMLInputElement | null>(null)
const avatar = defineModel<string | undefined>()

const avatarSource = computed<string>(() => avatar.value || (isDarkMode.value ? AvatarPlaceholderDark : AvatarPlaceholderLight))

function uploadAvatar() {
	fileInput.value?.click()
}

function handleFileChange(event: Event) {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]
	if (file) {
		if (file.size > context.value.constants.MAX_AVATAR_FILE_SIZE!) {
			alert(
				t('errors.avatar.fileSize', {
					value: context.value.constants.MAX_AVATAR_FILE_SIZE! / 1024 / 1024
				})
			)
			return
		}

		const reader = new FileReader()
		reader.onload = () => {
			avatar.value = reader.result as string
		}
		reader.readAsDataURL(file)
	}
}

function removeAvatar() {
	avatar.value = undefined
}
</script>

<template>
	<div :aria-label="$t('sonder@core-identity.form.avatar.section')">
		<img
			data-testid="character-image"
			:src="avatarSource"
			:alt="$t(`sonder@core-identity.form.avatar.${avatar ? 'label' : 'empty'}`)"
			class="aspect-square w-full rounded-xl shadow-md mb-4 object-cover"
		/>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-1">
			<Button
				class="bg-danger md:row-start-2"
				@click="removeAvatar"
			>
				<ion-icon
					:icon="trash"
					class="text-xl"
					aria-hidden="true"
					data-testid="character-image-remove-button"
				/>
				{{ $t('common.actions.remove') }}
			</Button>
			<Button @click="uploadAvatar">
				<ion-icon
					:icon="image"
					class="text-xl"
					aria-hidden="true"
				/>
				{{ $t('common.actions.upload') }}
				<input
					ref="fileInput"
					data-testid="character-image-upload-button"
					type="file"
					class="sr-only"
					accept=".jpeg,.jpg,.gif,.webp,.png"
					@change="handleFileChange"
				/>
			</Button>
		</div>
	</div>
</template>
