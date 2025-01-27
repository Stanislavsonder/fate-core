<script setup lang="ts">
import { FateModuleConfigGroup, FateModuleConfigOption, FateModuleManifest } from '@/modules/utils/types'
import { computed } from 'vue'
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue'
import ModuleConfigOption from '@/components/CharacterCreate/ModuleConfigOption.vue'
import { LANGUAGES } from '@/i18n/constants'
import { openOutline } from 'ionicons/icons'

const { fateModule } = defineProps<{
	fateModule: FateModuleManifest
}>()

const moduleConfig = defineModel<Record<string, unknown>>({
	default: {},
	required: false
})

const configStructure = computed(() => {
	if (!fateModule?.config?.options) return []

	const groupsInfo = new Map<string, FateModuleConfigGroup>([...(fateModule.config.groups || [])].map(group => [group.id, group]))

	const groups = new Map<string, FateModuleConfigOption[]>()
	for (const option of fateModule.config.options) {
		const group = option.groupId || 'default'
		if (!groups.has(group)) groups.set(group, [])
		groups.get(group)?.push(option)
	}

	return Array.from(groups).map(([groupId, options]) => {
		return {
			info: groupsInfo.get(groupId),
			options
		}
	})
})

function setConfig(id: string, value: unknown) {
	if (fateModule.config?.options.find(e => e.id === id)?.default === value) {
		delete moduleConfig.value[id]
		return
	}

	moduleConfig.value[id] = value
}

function resetConfig() {
	moduleConfig.value = {}
}
</script>

<template>
	<ion-list
		lines="none"
		inset
	>
		<ion-item>
			<ion-label>
				<h3>{{ $t('modules.configuration.name') }}</h3>
				<p>{{ $t(fateModule.name) }}</p>
			</ion-label>
		</ion-item>
		<ion-item>
			<ion-label>
				<h3>{{ $t('modules.configuration.id') }}</h3>
				<p>{{ fateModule.id }}</p>
			</ion-label>
		</ion-item>
		<ion-item>
			<ion-label>
				<h3>{{ $t('modules.configuration.version') }}</h3>
				<p>{{ fateModule.version }}</p>
			</ion-label>
		</ion-item>
		<ion-item>
			<ion-label>
				<h3>{{ $t('modules.configuration.description') }}</h3>
				<p>{{ $t(fateModule?.description?.full || '') }}</p>
			</ion-label>
		</ion-item>
		<ion-item>
			<ion-label>
				<h3>{{ $t('modules.configuration.author') }}</h3>
				<p>
					<component
						:is="fateModule.author.url ? 'a' : 'span'"
						:href="fateModule.author.url"
					>
						{{ fateModule.author.name }}
						<ion-icon
							v-if="fateModule.author.url"
							:icon="openOutline"
						/>
					</component>
				</p>
				<p v-if="fateModule.author.email">
					<a :href="`mailto:${fateModule.author.url}`">
						{{ fateModule.author.email }}
						<ion-icon :icon="openOutline" />
					</a>
				</p>
			</ion-label>
		</ion-item>
		<ion-item>
			<ion-label>
				<h3>
					{{ $t('modules.configuration.languages') }}
					({{ fateModule.languages.length }})
				</h3>
				<p>
					{{ fateModule.languages.map(lang => LANGUAGES[lang].nativeName).join(', ') }}
				</p>
			</ion-label>
		</ion-item>
		<ion-item v-if="fateModule.dependencies">
			<ion-label>
				<h3>{{ $t('modules.configuration.dependencies') }}</h3>
				<p>
					{{
						Object.entries(fateModule.dependencies)
							.map(e => {
								return `${e[0]}: ${e[1]}`
							})
							.join(', ')
					}}
					}) }}
				</p>
			</ion-label>
		</ion-item>
	</ion-list>

	<ion-label class="px-8 font-bold">
		{{ $t('modules.configuration.label') }}
	</ion-label>
	<ion-list
		v-for="group in configStructure"
		:key="group?.info?.id"
		inset
	>
		<ion-item
			v-if="group.info"
			lines="full"
		>
			<ion-label>
				<h3>{{ $t(group.info.name) }}</h3>
				<p v-if="group.info?.description">{{ $t(group.info.description) }}</p>
			</ion-label>
		</ion-item>
		<ModuleConfigOption
			v-for="option in group.options"
			:key="option.id"
			:value="moduleConfig[option.id]"
			:option="option"
			@change="setConfig"
		/>
	</ion-list>
	<ion-button
		:disabled="!Object.keys(moduleConfig).length"
		expand="full"
		color="danger"
		fill="clear"
		@click="resetConfig"
	>
		{{ $t('common.actions.reset') }}
	</ion-button>
</template>
