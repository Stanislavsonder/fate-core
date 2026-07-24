<script setup lang="ts">
import { ref, markRaw, type Component } from 'vue'
import * as vue from 'vue'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonNote } from '@ionic/vue'
import { isIos } from '@/utils/helpers/platform'
import { ROUTES } from '@/router'

// Modules 2.0 Phase 0 spike (planning/modules-2-0/phase-0-groundwork.md, Step 5).
// Proves blob-URL import() + a FateSDK-shim can render a component using the
// host's own Vue instance. Only reachable from Settings when debug mode is
// enabled (see useDebug.ts) — not part of the Modules 2.0 product code.

;(globalThis as unknown as { FateSDK: { vue: typeof vue } }).FateSDK = { vue }

const log = ref<string[]>([])
const spikeComponent = ref<Component | null>(null)
const importMs = ref<number | null>(null)
const shaResult = ref<string | null>(null)

function addLog(line: string) {
	log.value = [...log.value, line]
}

const SPIKE_MOD_SOURCE = `
	const { h, ref } = globalThis.FateSDK.vue;
	export default {
		name: 'SpikeMod',
		setup() {
			const n = ref(0);
			return () => h('button', { onClick: () => n.value++ }, 'clicks: ' + n.value);
		}
	};
`

async function runImportSpike() {
	log.value = []
	spikeComponent.value = null
	importMs.value = null

	try {
		addLog(`Blob string size: ${SPIKE_MOD_SOURCE.length} bytes`)
		const blob = new Blob([SPIKE_MOD_SOURCE], { type: 'text/javascript' })
		const url = URL.createObjectURL(blob)
		addLog(`Blob URL created: ${url.slice(0, 40)}...`)

		const start = performance.now()
		const mod = await import(/* @vite-ignore */ url)
		importMs.value = performance.now() - start
		URL.revokeObjectURL(url)

		addLog(`import() resolved in ${importMs.value.toFixed(2)}ms`)
		spikeComponent.value = markRaw(mod.default)
		addLog('Component mounted below — click it. If the counter increments, shared-Vue reactivity works across the import() boundary.')
	} catch (error) {
		addLog(`FAILED: ${error instanceof Error ? error.message : String(error)}`)
	}
}

async function runCryptoSpike() {
	try {
		if (!('crypto' in globalThis) || !crypto.subtle) {
			shaResult.value = 'crypto.subtle unavailable (not a secure context?)'
			return
		}
		const data = new TextEncoder().encode(SPIKE_MOD_SOURCE)
		const digest = await crypto.subtle.digest('SHA-256', data)
		const hex = Array.from(new Uint8Array(digest))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
		shaResult.value = hex
	} catch (error) {
		shaResult.value = `FAILED: ${error instanceof Error ? error.message : String(error)}`
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
				<ion-title class="px-4">Modules 2.0 spike (dev)</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-list inset>
				<ion-item>
					<ion-label>
						<h2>1. Blob-URL import()</h2>
						<p>Imports a hand-written compiled component string via URL.createObjectURL + import().</p>
					</ion-label>
				</ion-item>
			</ion-list>

			<ion-button
				expand="block"
				@click="runImportSpike"
			>
				Run import() spike
			</ion-button>

			<div
				v-if="spikeComponent"
				class="ion-margin-top ion-text-center"
			>
				<component :is="spikeComponent" />
			</div>

			<ion-list
				inset
				class="ion-margin-top"
			>
				<ion-item
					v-for="(line, i) in log"
					:key="i"
				>
					<ion-note>{{ line }}</ion-note>
				</ion-item>
			</ion-list>

			<ion-list inset>
				<ion-item>
					<ion-label>
						<h2>2. crypto.subtle.digest availability</h2>
						<p>SHA-256 hashing requires a secure context (https:// / capacitor://). Dev-mode plain http:// will fail — expected.</p>
					</ion-label>
				</ion-item>
			</ion-list>

			<ion-button
				expand="block"
				@click="runCryptoSpike"
			>
				Run crypto.subtle spike
			</ion-button>

			<ion-list
				v-if="shaResult"
				inset
				class="ion-margin-top"
			>
				<ion-item>
					<ion-note class="break-all">{{ shaResult }}</ion-note>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>
