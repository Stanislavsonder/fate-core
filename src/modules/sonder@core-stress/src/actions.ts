import { Character, FateContext } from '@/types'
import stress from './stress'
import manifest from '../manifest.json'
import { clone } from '@/utils'

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	const config = character._modules[manifest.id]?.config
	let filteredStress = clone(stress)

	if (config) {
		filteredStress = filteredStress.filter(s => config[`${s._id}-enabled`] !== false)
	}

	if (filteredStress.length === 0) {
		return
	}

	// Enable stress if it's not already enabled
	context.stress.enabled = true

	// Add module stress
	if (!context.stress.list) {
		context.stress.list = []
	}

	context.stress.list.push(...filteredStress)
	context.stress.map = new Map(context.stress.list.map(s => [s._id, s]))

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
	// Remove module stress
	context.stress.list = context.stress.list.filter(s => {
		return s._module.name !== manifest.id
	})

	context.stress.map = new Map(context.stress.list.map(s => [s._id, s]))

	// Remove module stress from character
	Object.keys(character.stress).forEach(key => {
		if (context.stress.map.has(key)) {
			delete character.stress[key]
		}
	})
}

export function onUpdate(context: FateContext, character: Character): Promise<void> | void {
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
	context.stress.list = context.stress.list.filter(s => {
		return s._module.name !== manifest.id
	})
	context.stress.list.push(...filteredStress)
	context.stress.map = new Map(context.stress.list.map(s => [s._id, s]))

	// Update character
	stress.forEach(s => {
		if (context.stress.map.has(s._id) && !character.stress[s._id]) {
			character.stress[s._id] = s.boxes
		} else if (!context.stress.map.has(s._id) && character.stress[s._id]) {
			delete character.stress[s._id]
		}
	})
}
