import type { Character, FateContext } from '@/types'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	character.inventory = character.inventory ?? []
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	delete character.inventory
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {
	// Nothing to do
}
