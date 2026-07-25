<script setup lang="ts">
import {
	IonBackButton,
	IonBadge,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonNote,
	IonPage,
	IonTitle,
	IonToolbar
} from '@ionic/vue'
import { onMounted, ref } from 'vue'
import { isIos } from '@/utils/helpers/platform'
import { ROUTES } from '@/router'
import { ModRegistry, type ModSource, type ModStatus } from '@/mods/modRegistry'
import { safeManifest } from '@/mods/loader'
import { registerModTranslations } from '@/mods/registerModTranslations'
import { modsService } from '@/db/tables/mods'
import { setEnabled, update, remove } from '@/mods/installService'
import { confirmRemove } from '@/utils/helpers/dialog'
import { showErrorToast, showSuccessToast, showWarningToast } from '@/utils/helpers/toast'
import i18n from '@/i18n'

const { t } = i18n.global

interface ModRow {
	id: string
	name: string
	version: string
	source: ModSource
	status: ModStatus
	error?: string
}

const rows = ref<ModRow[]>([])
const busyId = ref<string | null>(null)

async function refresh() {
	try {
		const storedRows = await modsService.getAll()
		rows.value = storedRows.map(stored => {
			const record = ModRegistry.get(stored.id)
			if (record) {
				return {
					id: stored.id,
					name: record.manifest.name || stored.id,
					version: record.manifest.version,
					source: record.source,
					status: record.status,
					error: record.error
				}
			}
			// Not loaded this session (e.g. disabled before this boot) — fall back to the stored manifest for display.
			const fallback = safeManifest(stored)
			try {
				registerModTranslations(stored.id, JSON.parse(stored.translationsJson || '{}'))
			} catch {
				// Malformed stored translations — name display falls back to the raw id.
			}
			return {
				id: stored.id,
				name: fallback.name || stored.id,
				version: fallback.version || stored.version,
				source: stored.source,
				status: 'disabled' as ModStatus
			}
		})
	} catch (e) {
		await showErrorToast('settings.mods.errors.list', { error: e instanceof Error ? e.message : String(e) })
	}
}

onMounted(refresh)

async function toggleEnabled(row: ModRow) {
	busyId.value = row.id
	try {
		const result = await setEnabled(row.id, row.status === 'disabled')
		if (!result.ok) {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busyId.value = null
		await refresh()
	}
}

async function retry(row: ModRow) {
	busyId.value = row.id
	try {
		const result = await setEnabled(row.id, true)
		if (!result.ok) {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busyId.value = null
		await refresh()
	}
}

async function updateMod(row: ModRow) {
	busyId.value = row.id
	try {
		const result = await update(row.id)
		if (result.ok) {
			await showSuccessToast('settings.mods.updateSuccess', { id: row.id })
		} else {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busyId.value = null
		await refresh()
	}
}

async function removeMod(row: ModRow) {
	if (!(await confirmRemove(t(row.name)))) {
		return
	}

	busyId.value = row.id
	try {
		const result = await remove(row.id)
		if (result.ok) {
			return
		}
		if (result.reason === 'blocked') {
			await showWarningToast('settings.mods.removeBlocked', { characters: result.characterNames.join(', ') })
		} else {
			await showErrorToast('settings.mods.errors.action', { error: result.error })
		}
	} finally {
		busyId.value = null
		await refresh()
	}
}
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button
						:default-href="ROUTES.SETTINGS"
						:text="isIos ? $t('common.actions.back') : undefined"
					/>
				</ion-buttons>
				<ion-title class="px-4">{{ $t('settings.mods.title') }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-list
				v-if="rows.length"
				:inset="true"
			>
				<ion-item
					v-for="row in rows"
					:key="row.id"
					lines="full"
				>
					<ion-label>
						<h2>{{ $t(row.name) }}</h2>
						<p>{{ row.id }} · v{{ row.version }} · {{ $t(`settings.mods.source.${row.source}`) }}</p>
						<p v-if="row.error">{{ row.error }}</p>
						<ion-badge :color="row.status === 'loaded' ? 'success' : row.status === 'errored' ? 'danger' : 'medium'">
							{{ $t(`settings.mods.status.${row.status}`) }}
						</ion-badge>
					</ion-label>
					<ion-buttons slot="end">
						<ion-button
							v-if="row.status === 'errored'"
							:disabled="busyId === row.id"
							@click="retry(row)"
						>
							{{ $t('settings.mods.actions.retry') }}
						</ion-button>
						<ion-button
							v-else
							:disabled="busyId === row.id"
							@click="toggleEnabled(row)"
						>
							{{ $t(row.status === 'disabled' ? 'settings.mods.actions.enable' : 'settings.mods.actions.disable') }}
						</ion-button>
						<ion-button
							v-if="row.source === 'url'"
							:disabled="busyId === row.id"
							@click="updateMod(row)"
						>
							{{ $t('settings.mods.actions.update') }}
						</ion-button>
						<ion-button
							color="danger"
							:disabled="busyId === row.id"
							@click="removeMod(row)"
						>
							{{ $t('settings.mods.actions.remove') }}
						</ion-button>
					</ion-buttons>
				</ion-item>
			</ion-list>
			<ion-note
				v-else
				class="ion-padding block"
			>
				{{ $t('settings.mods.empty') }}
			</ion-note>
		</ion-content>
	</ion-page>
</template>
