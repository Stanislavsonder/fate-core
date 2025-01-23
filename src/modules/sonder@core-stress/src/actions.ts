import { Character, FateContext } from '@/types'
import stress from './stress'

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	context.stress.enabled = true

	// If no other stress is present, add the module stress
	if (!character.stress.length || character.stress.length === 0) {
		character.stress = [...stress]
		return
	}

	// If other stress is present, add the module stress if it doesn't exist
	character.stress.push(...stress)
}

export function onUninstall(context: FateContext, character: Character): Promise<void> | void {
	// Remove module stress
	character.stress = character.stress.filter(s => !stress.includes(s))

	// Disable stress if no other stress is present
	if (character.stress.length === 0) {
		context.stress.enabled = false
	}
}
