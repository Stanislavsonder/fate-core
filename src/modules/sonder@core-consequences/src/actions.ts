import type { Character, FateContext } from '@/types'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	character.consequences = character.consequences ?? []
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	delete character.consequences
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {}
