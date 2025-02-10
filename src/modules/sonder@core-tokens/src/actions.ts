import type { Character, FateContext } from '@/types'
import manifest from '../manifest.json'

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	const overrideMaxTokens: number = Number(character._modules[manifest.id].config!['max-tokens'])
	if (isNaN(overrideMaxTokens)) {
		throw new Error('Max tokens must be a number. Got: ' + character._modules[manifest.id].config!['max-tokens'])
	}

	context.constants.MAX_TOKENS = overrideMaxTokens ?? context.constants.MAX_TOKENS
	character.tokens = character.tokens ?? context.constants.DEFAULT_TOKENS
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	// @ts-ignore
	delete character.tokens
}

export function onReconfigure(context: FateContext, character: Character): Promise<void> | void {
	const overrideMaxTokens: number = Number(character._modules[manifest.id].config!['max-tokens'])
	if (isNaN(overrideMaxTokens)) {
		throw new Error('Max tokens must be a number. Got: ' + character._modules[manifest.id].config!['max-tokens'])
	}

	context.constants.MAX_TOKENS = overrideMaxTokens ?? context.constants.MAX_TOKENS
	character.tokens = character.tokens > context.constants.MAX_TOKENS ? context.constants.MAX_TOKENS : character.tokens
}
