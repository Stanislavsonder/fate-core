import type { Character, FateContext } from '@/types'

export function onInstall(_context: FateContext, character: Character): Promise<void> | void {
	character.aspects = character.aspects ?? []
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	delete character.aspects
}

export function onReconfigure(_context: FateContext, _character: Character): Promise<void> | void {}
