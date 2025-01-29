<script setup lang="ts">
import Modules from '@/modules'
import { ref } from 'vue'
import { FateModuleManifest } from '@/modules/utils/types'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import ModuleInfo from '@/components/CharacterCreate/ModuleInfo.vue'
import { Character, CharacterModules } from '@/types'
import { settings } from 'ionicons/icons'
import { IonIcon, IonCheckbox, IonItem, IonList, IonLabel, IonNote, IonInput } from '@ionic/vue'
import useFate from '@/store/useFate'
import { clone } from '@/utils'
import CharacterService from '@/service/character.service'

const emit = defineEmits<{
	create: [Character]
}>()

const { templates } = useFate()
const name = ref<string>('')
const selectedModule = ref<FateModuleManifest | undefined>(undefined)
const isModalOpen = ref<boolean>(false)
const installedModules = ref<CharacterModules>({})
const tmpConfig = ref<Record<string, Record<string, unknown>>>(Object.fromEntries(Modules.map(k => [k.id, {}])))

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
	name.value = ''
	installedModules.value = {}
	tmpConfig.value = Object.fromEntries(Modules.map(k => [k.id, {}]))
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
</script>

<template>
	<ion-list inset>
		<ion-item>
			<ion-input
				v-model="name"
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
		>
			<ion-checkbox
				slot="start"
				:checked="!!installedModules[m.id]"
				@ion-change="toggleModule(m.id, m.version)"
			/>
			<ion-label>
				<h3>
					{{ $t(m.name) }}
					<ion-note>{{ m.version }}</ion-note>
				</h3>
				<p>{{ $t(m.description.short) }}</p>
			</ion-label>
			<ion-chip
				v-if="Object.keys(tmpConfig[m.id]).length"
				color="warning"
			>
				{{ Object.keys(tmpConfig[m.id]).length }}
			</ion-chip>
			<ion-button
				v-if="m.config"
				slot="end"
				fill="clear"
				@click="openModuleModal(m)"
			>
				<ion-icon :icon="settings" />
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
		class="mx-4"
		:disabled="!name || !Object.keys(installedModules).length"
		expand="block"
		color="primary"
		@click="create"
	>
		{{ $t('common.actions.create') }}
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
