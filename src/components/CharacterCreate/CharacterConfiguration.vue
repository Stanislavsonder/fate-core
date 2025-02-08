<script setup lang="ts">
import Modules from '@/modules'
import { ref } from 'vue'
import type { FateModuleManifest } from '@/modules/utils/types'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import ModuleInfo from '@/components/CharacterCreate/ModuleInfo.vue'
import type { Character, CharacterModules } from '@/types'
import { settings, informationCircle } from 'ionicons/icons'
import { IonIcon, IonCheckbox, IonItem, IonList, IonLabel, IonNote, IonInput, IonBadge, IonButton } from '@ionic/vue'
import useFate from '@/store/useFate'
import { clone } from '@/utils/helpers/clone'
import CharacterService from '@/service/character.service'

const { initialConfig, initialName } = defineProps<{
	initialConfig?: CharacterModules
	initialName?: string
}>()

const emit = defineEmits<{
	create: [Character]
	update: [CharacterModules]
}>()

const { templates } = useFate()
const name = ref<string>(initialName || '')
const selectedModule = ref<FateModuleManifest | undefined>(undefined)
const isModalOpen = ref<boolean>(false)
const installedModules = ref<CharacterModules>({})
const tmpConfig = ref<Record<string, Record<string, unknown>>>(Object.fromEntries(Modules.map(k => [k.id, {}])))

initConfig()

function openModuleModal(m: FateModuleManifest) {
	selectedModule.value = m
	isModalOpen.value = true
}

function toggleModule(id: string, version: string) {
	if (installedModules.value[id]) {
		uninstallModule(id)
	} else {
		installModule(id, version)
	}
}

function installModule(id: string, version: string) {
	installedModules.value[id] = {
		version,
		config: tmpConfig.value[id]
	}
}

function uninstallModule(id: string) {
	delete installedModules.value[id]
}

function create() {
	const character: Character = {
		...templates.character,
		name: name.value,
		_modules: clone(installedModules.value)
	}
	emit('create', character)
}

async function importModules() {
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = CharacterService.CHARACTER_MODULE_EXTENSION
	input.onchange = async (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			const modules = await CharacterService.importCharacterModules(file)
			applyImportedModules(modules)
		}
	}
	input.click()
}

function applyImportedModules(modules: CharacterModules) {
	installedModules.value = {}
	tmpConfig.value = Object.fromEntries(Modules.map(k => [k.id, {}]))
	for (const [id, m] of Object.entries(modules)) {
		installModule(id, m.version)
		tmpConfig.value[id] = m.config || {}
	}
}

function initConfig() {
	if (initialConfig) {
		installedModules.value = initialConfig
		for (const [id, mod] of Object.entries(initialConfig)) {
			tmpConfig.value[id] = mod.config || {}
		}
	}
}

function update() {
	const newConfig = clone(installedModules.value)
	for (const [id, mod] of Object.entries(newConfig)) {
		mod.config = tmpConfig.value[id]
	}
	emit('update', newConfig)
}
</script>

<template>
	<ion-list inset>
		<ion-item>
			<ion-input
				v-model="name"
				data-testid="character-name-input"
				:disabled="!!initialName"
				:label="$t('identity.form.name.placeholder')"
			/>
		</ion-item>
	</ion-list>
	<ion-label>
		<h2 class="px-8">{{ $t('modules.selected') }}:</h2>
	</ion-label>
	<ion-list inset>
		<ion-item
			v-for="m in Modules"
			:key="m.id"
			data-testid="module-list-item"
			@ion-change="toggleModule(m.id, m.version)"
		>
			<ion-checkbox
				slot="start"
				data-testid="module-checkbox"
				:checked="!!installedModules[m.id]"
			/>
			<ion-label>
				<h3>
					{{ $t(m.name) }}
					<ion-note>{{ m.version }}</ion-note>
				</h3>
				<p>{{ $t(m.description.short) }}</p>
			</ion-label>
			<ion-badge v-if="Object.keys(tmpConfig[m.id]).length">
				{{ Object.keys(tmpConfig[m.id]).length }}
			</ion-badge>
			<ion-button
				slot="end"
				fill="clear"
				@click.stop="openModuleModal(m)"
			>
				<ion-icon :icon="m.config?.options?.length ? settings : informationCircle" />
			</ion-button>
		</ion-item>
	</ion-list>
	<ion-note class="text-center block">
		{{ $t('common.or') }}
	</ion-note>
	<ion-button
		class="mx-4"
		expand="block"
		fill="clear"
		@click="importModules"
	>
		{{ $t('modules.import') }}
	</ion-button>
	<ion-button
		data-testid="create-character-form-button"
		class="mx-4"
		:disabled="!name || !Object.keys(installedModules).length"
		expand="block"
		color="primary"
		@click="initialConfig ? update() : create()"
	>
		{{ $t(initialConfig ? 'common.actions.update' : 'common.actions.create') }}
	</ion-button>

	<ModalWindow
		v-if="selectedModule"
		v-model="isModalOpen"
		:title="$t((selectedModule?.name as string) || '')"
	>
		<ModuleInfo
			v-model="tmpConfig[selectedModule?.id as string]"
			:fate-module="selectedModule"
		/>
	</ModalWindow>
</template>
