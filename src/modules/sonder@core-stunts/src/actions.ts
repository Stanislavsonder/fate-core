import type { Character, FateContext } from '@/types'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	character.stunts = character.stunts ?? []
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	// @ts-ignore
	delete character.stunts
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {}
