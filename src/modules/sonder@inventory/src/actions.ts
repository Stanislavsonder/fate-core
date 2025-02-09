import type { Character, FateContext } from '@/types'

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	character.inventory = character.inventory ?? []
}

export function onUninstall(context: FateContext, character: Character): Promise<void> | void {
	// @ts-ignore
	delete character.inventory
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {
	// Nothing to do
}
