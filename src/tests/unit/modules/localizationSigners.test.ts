import { describe, it, expect } from 'vitest'
import { signTranslations, signTranslation, signRecord } from '@/modules/utils/localizationSigners' // import your actual file path

describe('signTranslation', () => {
	it('should create an object with a given id key and the original translation as its value', () => {
		const input = { en: 'Hello' }
		const id = 'myId'
		const result = signTranslation(input, id)

		// Expect an object: { myId: { en: 'Hello' } }
		expect(result).toEqual({ [id]: input })
	})
})

describe('signTranslations', () => {
	it('should sign each translation with the given id', () => {
		const translations = {
			header: { en: 'Header', de: 'Kopfzeile' },
			footer: { en: 'Footer', de: 'Fußzeile' }
		}
		const id = 'page'
		const result = signTranslations(translations, id)

		// Each value is now: { page: originalValue }
		expect(result.header).toEqual({ [id]: translations.header })
		expect(result.footer).toEqual({ [id]: translations.footer })
	})
})

describe('signRecord', () => {
	it('should prepend "id." for specific keys when passed in `keys` array', () => {
		const record = { label: 'someLabel', value: 'someValue' }
		const signed = signRecord(record, 'widget', ['label'])

		// Only 'label' gets "widget." prefix
		expect(signed.label).toBe('widget.someLabel')
		// 'value' is not prefixed since it's not in keys
		expect(signed.value).toBe('someValue')
	})

	it('should replace "t." prefix with "id." if the value is a string starting with "t."', () => {
		const record = { title: 't.myTitle', other: 'noChange' }
		const signed = signRecord(record, 'component')

		// 'title' starts with 't.' -> replaced with 'component.'
		expect(signed.title).toBe('component.myTitle')
		expect(signed.other).toBe('noChange')
	})

	it('should recursively sign nested objects', () => {
		const record = {
			main: {
				title: 't.mainTitle'
			},
			sub: {
				label: 't.subLabel',
				child: {
					text: 't.childText'
				}
			}
		}

		const signed = signRecord(record, 'app')
		expect(signed.main.title).toBe('app.mainTitle')
		expect(signed.sub.label).toBe('app.subLabel')
		expect(signed.sub.child.text).toBe('app.childText')
	})

	it('should handle arrays of objects', () => {
		const recordArray = [
			{ label: 't.one', description: 't.descOne' },
			{ label: 't.two', description: 't.descTwo' }
		]

		const signedArray = signRecord(recordArray, 'block') // returns T[]

		// Both objects in the array should be signed
		expect(signedArray[0].label).toBe('block.one')
		expect(signedArray[0].description).toBe('block.descOne')
		expect(signedArray[1].label).toBe('block.two')
		expect(signedArray[1].description).toBe('block.descTwo')
	})

	it('should prefix only specified keys if `keys` is provided', () => {
		const record = { title: 't.titleKey', name: 'John Doe' }
		const signed = signRecord(record, 'modal', ['name'])

		// name is in `keys`, so gets "modal." prefix
		expect(signed.name).toBe('modal.John Doe')
		// title is 't.titleKey', so it also gets replaced with 'modal.titleKey'
		expect(signed.title).toBe('modal.titleKey')
	})
})
