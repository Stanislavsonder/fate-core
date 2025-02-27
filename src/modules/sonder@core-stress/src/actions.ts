import type { Character, FateContext } from '@/types'
import stress from './stress'
import manifest from '../manifest.json'
import { clone } from '@/utils/helpers/clone'
import type { Stress } from './types'
import { mergeArraysById } from '@/utils/helpers/mergeArrays'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	const config = character._modules[manifest.id]?.config
	let filteredStress = clone<Stress[]>(stress)
	if (config) {
		filteredStress = filteredStress.filter(s => config[`${s.id}-enabled`] !== false)
	}

	if (filteredStress.length === 0) {
		return
	}
	character.stress = character.stress ? mergeArraysById(character.stress, filteredStress) : filteredStress
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	delete character.stress
}

export function onReconfigure(context: FateContext, character: Character): Promise<void> | void {
	const config = character._modules[manifest.id]?.config
	let filteredStress = clone<Stress[]>(stress)

	if (config) {
		filteredStress = filteredStress.filter(s => {
			return config[`${s.id}-enabled`] !== false
		})
	}

	if (filteredStress.length === 0) {
		return
	}

	// Update character
	character.stress = mergeArraysById(character.stress || [], filteredStress)
}
