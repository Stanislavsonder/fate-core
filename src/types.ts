export * from '@fate-core/mod-types'

export type TranslationNode = string | TranslationMap

export interface TranslationMap {
	[key: string]: TranslationNode
}

export type Translation = TranslationMap
