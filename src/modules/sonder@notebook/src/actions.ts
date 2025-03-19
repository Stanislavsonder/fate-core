import type { Character, FateContext } from '@/types'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	character.notes = character.notes || ''
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	delete character.notes
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {}
