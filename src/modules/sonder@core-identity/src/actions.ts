import type { Character, FateContext } from '@/types'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	character.description = character.description ?? ''
	character.race = character.race ?? ''
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	// @ts-ignore
	delete character.description
	// @ts-ignore
	delete character.avatar
	// @ts-ignore

	delete character.race
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {}
