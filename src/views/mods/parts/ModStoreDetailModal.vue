<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import { IonButton, IonBadge, IonChip, IonLabel, IonNote, IonList, IonItem } from '@ionic/vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import { type RegistryModEntry } from '@/mods/registryClient'
import { isEntryCompatible, installFromRegistry, updateFromRegistry, remove } from '@/mods/installService'
import { modsService } from '@/db/tables/mods'
import useRegistryBase from '@/composables/useRegistryBase'
import { confirmRemove } from '@/utils/helpers/dialog'
import { showErrorToast, showSuccessToast, showWarningToast } from '@/utils/helpers/toast'
import i18n from '@/i18n'

const { entry } = defineProps<{ entry: RegistryModEntry }>()
const emit = defineEmits<{ changed: [] }>()
const isOpen = defineModel<boolean>({ default: false })

const { locale } = useI18n()
const { t } = i18n.global
const { getRegistryBase } = useRegistryBase()

const busy = ref(false)
const installedVersion = ref<string | null>(null)
const readmeHtml = ref('')

const strings = computed(() => entry.strings[locale.value] ?? entry.strings.en ?? Object.values(entry.strings)[0] ?? { name: entry.id, short: '' })
const compatible = computed(() => isEntryCompatible(entry))
const hasUpdate = computed(() => installedVersion.value !== null && installedVersion.value !== entry.latestVersion)

async function refreshInstalledState() {
	const row = await modsService.get(entry.id)
	installedVersion.value = row?.version ?? null
}

async function loadReadme() {
	readmeHtml.value = ''
	if (!entry.readmeUrl) {
		return
	}
	try {
		const res = await fetch(`${getRegistryBase()}/${entry.readmeUrl}`)
		if (!res.ok) {
			return
		}
		const raw = await res.text()
		readmeHtml.value = new MarkdownIt().render(raw)
	} catch {
		// README is supplementary — a failed fetch just leaves the section empty.
	}
}

watch(
	isOpen,
	open => {
		if (open) {
			refreshInstalledState()
			loadReadme()
		}
	},
	{ immediate: true }
)

async function install() {
	busy.value = true
	try {
		const result = await installFromRegistry(entry.id)
		if (result.ok) {
			await showSuccessToast('settings.mods.installSuccess', { id: entry.id })
			await refreshInstalledState()
			emit('changed')
		} else {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busy.value = false
	}
}

async function performUpdate() {
	busy.value = true
	try {
		const result = await updateFromRegistry(entry.id)
		if (result.ok) {
			await showSuccessToast('settings.mods.updateSuccess', { id: entry.id })
			await refreshInstalledState()
			emit('changed')
		} else {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busy.value = false
	}
}

async function performRemove() {
	if (!(await confirmRemove(strings.value.name))) {
		return
	}
	busy.value = true
	try {
		const result = await remove(entry.id)
		if (result.ok) {
			await refreshInstalledState()
			emit('changed')
		} else if (result.reason === 'blocked') {
			await showWarningToast('settings.mods.removeBlocked', { characters: result.characterNames.join(', ') })
		} else {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busy.value = false
	}
}
</script>

<template>
	<ModalWindow
		v-model="isOpen"
		:title="strings.name"
	>
		<div class="p-4">
			<p class="text-secondary">{{ $t('settings.mods.detail.author', { name: entry.author.name }) }}</p>

			<ion-badge
				v-if="!compatible"
				color="danger"
			>
				{{ $t('settings.mods.browse.incompatible') }}
			</ion-badge>

			<p class="mt-2">{{ t(entry.description.full || entry.description.short) }}</p>

			<div
				v-if="entry.tags.length"
				class="mt-2 flex flex-wrap gap-1"
			>
				<ion-chip
					v-for="tag in entry.tags"
					:key="tag"
				>
					{{ tag }}
				</ion-chip>
			</div>

			<div class="mt-4">
				<ion-button
					v-if="!installedVersion"
					:disabled="busy || !compatible"
					expand="block"
					@click="install"
				>
					{{ $t('settings.mods.detail.install') }}
				</ion-button>
				<template v-else>
					<ion-note class="block">{{ $t('settings.mods.detail.installed') }}: v{{ installedVersion }}</ion-note>
					<ion-button
						v-if="hasUpdate"
						:disabled="busy"
						expand="block"
						@click="performUpdate"
					>
						{{ $t('settings.mods.detail.updateAvailable') }} ({{ entry.latestVersion }})
					</ion-button>
					<ion-button
						color="danger"
						fill="outline"
						:disabled="busy"
						expand="block"
						@click="performRemove"
					>
						{{ $t('settings.mods.detail.remove') }}
					</ion-button>
				</template>
			</div>

			<template v-if="entry.config?.options?.length">
				<ion-label>
					<h3 class="mt-4">{{ $t('settings.mods.detail.config') }}</h3>
				</ion-label>
				<ion-list :inset="true">
					<ion-item
						v-for="option in entry.config.options"
						:key="option.id"
						lines="none"
					>
						<ion-label>{{ t(option.name) }}</ion-label>
						<ion-note slot="end">{{ option.type }}</ion-note>
					</ion-item>
				</ion-list>
			</template>

			<template v-if="entry.versions.length > 1">
				<ion-label>
					<h3 class="mt-4">{{ $t('settings.mods.detail.versions') }}</h3>
				</ion-label>
				<p class="text-secondary">{{ entry.versions.slice().reverse().join(', ') }}</p>
			</template>

			<template v-if="readmeHtml">
				<ion-label>
					<h3 class="mt-4">{{ $t('settings.mods.detail.readme') }}</h3>
				</ion-label>
				<!-- eslint-disable vue/no-v-html -->
				<div
					class="markdown"
					v-html="readmeHtml"
				/>
				<!-- eslint-enable vue/no-v-html -->
			</template>
		</div>
	</ModalWindow>
</template>
