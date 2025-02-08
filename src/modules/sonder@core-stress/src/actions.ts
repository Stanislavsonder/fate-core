import type { Character, FateContext } from '@/types'
import stress from './stress'
import manifest from '../manifest.json'
import { clone } from '@/utils/helpers/clone'

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	const config = character._modules[manifest.id]?.config
	let filteredStress = clone(stress)

	if (config) {
		filteredStress = filteredStress.filter(s => config[`${s._id}-enabled`] !== false)
	}

	if (filteredStress.length === 0) {
		return
	}
	for (const s of filteredStress) {
		context.stress.set(s._id, s)
	}

	// If no other stress is present, add the module stress
	if (!character.stress?.length) {
		character.stress = Object.fromEntries(filteredStress.map(s => [s._id, s.boxes]))
		return
	}

	// If other stress is present, add the module stress if it doesn't exist
	filteredStress.forEach(s => {
		if (!character.stress[s._id]) {
			character.stress[s._id] = s.boxes
		}
	})
}

export function onUninstall(context: FateContext, character: Character): Promise<void> | void {
	// Remove module stress from context
	stress.forEach(s => {
		context.stress.delete(s._id)
	})

	// Remove module stress from character
	stress.forEach(s => {
		delete character.stress[s._id]
	})
}

export function onReconfigure(context: FateContext, character: Character): Promise<void> | void {
	const config = character._modules[manifest.id]?.config
	let filteredStress = clone(stress)

	if (config) {
		filteredStress = filteredStress.filter(s => {
			return config[`${s._id}-enabled`] !== false
		})
	}

	if (filteredStress.length === 0) {
		return
	}

	// Update context
	context.stress.forEach((s, id) => {
		if (!filteredStress.find(f => f._id === id)) {
			context.stress.delete(id)
		}
	})
	filteredStress.forEach(s => {
		if (!context.stress.has(s._id)) {
			context.stress.set(s._id, s)
		}
	})

	// Update character
	stress.forEach(s => {
		if (context.stress.has(s._id) && !character.stress[s._id]) {
			character.stress[s._id] = s.boxes
		} else if (!context.stress.has(s._id) && character.stress[s._id]) {
			delete character.stress[s._id]
		}
	})
}
