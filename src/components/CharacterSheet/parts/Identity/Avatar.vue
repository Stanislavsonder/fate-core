<template>
	<div :aria-label="$t('identity.avatar.section')">
		<img
			:src="avatarSource"
			:alt="$t(`identity.avatar.${avatar ? 'label' : 'empty'}`)"
			class="aspect-square w-full rounded-xl shadow-md mb-4 object-cover" />
		<div class="grid grid-cols-2 gap-4">
			<Button class="bg-danger" @click="removeAvatar">
				<ion-icon :icon="trash" class="text-xl" aria-hidden="true"/>
				{{$t('actions.remove')}}
			</Button>
			<Button @click="uploadAvatar">
				<ion-icon :icon="image" class="text-xl" aria-hidden="true"/>
				{{$t('actions.upload')}}
				<input ref="fileInput" type="file"  class="hidden" accept=".jpeg,.jpg,.gif,.webp,.png" @change="handleFileChange"/>
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import AvatarPlaceholderDark from '@/assets/avatar-placeholder-dark.png'
import AvatarPlaceholderLight from '@/assets/avatar-placeholder-light.png'
import {trash, image} from 'ionicons/icons'
import {useI18n} from 'vue-i18n'
import Button from '@/components/ui/Button.vue'
import { MAX_AVATAR_FILE_SIZE } from '@/constants'
import useTheme from '@/composables/useTheme'

const {t} = useI18n()
const { isDarkMode } = useTheme()
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
		if (file.size > MAX_AVATAR_FILE_SIZE) {
			alert(t('errors.avatar-file-size'))
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
