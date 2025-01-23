import { describe, it, expect } from 'vitest'
import { signTranslation, signRecord, signTranslations } from '../../../src/modules/utils/localizationSigners'
import { Translation } from '../../../src/types'

describe('signTranslation', () => {
	it('should sign a translation with the given id', () => {
		const translation: Translation = { key: 'value' }
		const id = 'testId'
		const result = signTranslation(translation, id)
		expect(result).toEqual({ testId: translation })
	})
})

describe('signRecord', () => {
	it('should sign a record with the given id and keys', () => {
		const record = { key1: 't.value1', key2: 'value2' }
		const id = 'testId'
		const keys = ['key2']
		const result = signRecord(record, id, keys)
		expect(result).toEqual({ key1: 'testId.t.value1', key2: 'testId.value2' })
	})

	it('should sign an array of records with the given id and keys', () => {
		const records = [
			{ key1: 't.value1', key2: 'value2' },
			{ key1: 't.value3', key2: 'value4' }
		]
		const id = 'testId'
		const keys = ['key2']
		const result = signRecord(records, id, keys)
		expect(result).toEqual([
			{ key1: 'testId.t.value1', key2: 'testId.value2' },
			{ key1: 'testId.t.value3', key2: 'testId.value4' }
		])
	})

	it('should sign nested records with the given id and keys', () => {
		const record = { key1: { nestedKey: 't.value1' }, key2: 'value2' }
		const id = 'testId'
		const keys = ['key2']
		const result = signRecord(record, id, keys)
		expect(result).toEqual({ key1: { nestedKey: 'testId.t.value1' }, key2: 'testId.value2' })
	})
})

describe('signTranslations', () => {
	it('should sign all translations with the given id', () => {
		const translations: Record<string, Translation> = {
			en: { key: 'value' },
			fr: { key: 'valeur' }
		}
		const id = 'testId'
		const result = signTranslations(translations, id)
		expect(result).toEqual({
			en: { testId: { key: 'value' } },
			fr: { testId: { key: 'valeur' } }
		})
	})
})
