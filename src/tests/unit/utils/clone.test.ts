import { describe, it, expect } from 'vitest'
import { clone } from '@/utils/helpers/clone'
import { isReactive, isRef, reactive, ref } from 'vue' // Update the import path as needed

describe('clone', () => {
	it('should clone a number', () => {
		const value = 42
		const result = clone(value)
		expect(result).toBe(value)
		expect(typeof result).toBe('number')
	})

	it('should clone a string', () => {
		const value = 'Hello World'
		const result = clone(value)
		expect(result).toBe(value)
		expect(typeof result).toBe('string')
	})

	it('should clone a boolean', () => {
		const value = true
		const result = clone(value)
		expect(result).toBe(value)
		expect(typeof result).toBe('boolean')
	})

	it('should clone null', () => {
		const value = null
		const result = clone(value)
		expect(result).toBeNull()
	})

	it('should clone an array of primitives', () => {
		const arr = [1, 'two', false, null]
		const cloned = clone(arr)

		expect(cloned).toEqual(arr)
		expect(cloned).not.toBe(arr) // ensure different reference
	})

	it('should clone an object with primitive properties', () => {
		const obj = { x: 10, y: 'hello', z: true }
		const cloned = clone(obj)

		expect(cloned).toEqual(obj)
		expect(cloned).not.toBe(obj)
	})

	it('should deeply clone nested objects', () => {
		const nestedObj = {
			user: {
				name: 'John',
				address: {
					city: 'New York',
					zip: 12345
				}
			}
		}
		const cloned = clone(nestedObj)

		expect(cloned).toEqual(nestedObj)
		expect(cloned).not.toBe(nestedObj)

		// Check deeper references
		expect(cloned.user).not.toBe(nestedObj.user)
		expect(cloned.user.address).not.toBe(nestedObj.user.address)
	})

	it('should allow modifications to the cloned object without affecting the original', () => {
		const original = { name: 'Alice', age: 30 }
		const copy = clone(original)

		copy.age = 31

		expect(original.age).toBe(30)
		expect(copy.age).toBe(31)
	})

	it('should drop `undefined` values during cloning', () => {
		const obj = { a: 1, b: undefined }
		const cloned = clone(obj)

		// JSON.parse/JSON.stringify will remove properties set to undefined
		expect(cloned).toEqual({ a: 1 })
	})

	it('should convert Date objects to strings', () => {
		const now = new Date()
		const obj = { createdAt: now }
		const cloned = clone(obj)

		// The cloned.createdAt becomes a string in ISO format
		expect(typeof cloned.createdAt).toBe('string')
		expect(cloned.createdAt).toEqual(now.toISOString())
	})

	it('should not clone functions (they become undefined)', () => {
		const obj = {
			greet: function () {
				return 'Hello'
			}
		}
		const cloned = clone(obj)

		// Functions cannot be serialized in JSON; becomes undefined
		expect(cloned).toEqual({})
	})

	it('should skip symbol properties', () => {
		const sym = Symbol('test')
		const obj = { [sym]: 'symbol value', regularKey: 'regular value' }
		const cloned = clone(obj)

		// Symbol keys get ignored in JSON serialization
		expect(cloned).toEqual({ regularKey: 'regular value' })
	})

	it('should throw an error on circular references', () => {
		const obj: Record<string, unknown> = {}
		obj.self = obj

		// JSON.stringify on circular references throws a TypeError
		expect(() => clone(obj)).toThrowError(TypeError)
	})

	it('should clone complex arrays with objects inside', () => {
		const complexArray = [
			{ id: 1, items: ['a', 'b'] },
			{ id: 2, items: ['c', 'd'], nested: { test: 'value' } }
		]
		const cloned = clone(complexArray)

		expect(cloned).toEqual(complexArray)
		expect(cloned).not.toBe(complexArray)

		// Check deeper objects
		expect(cloned[0]).not.toBe(complexArray[0])
		expect(cloned[1].nested).not.toBe(complexArray[1].nested)
	})

	it('should handle empty objects and arrays', () => {
		const emptyObj = {}
		const emptyArr: unknown[] = []

		expect(clone(emptyObj)).toEqual({})
		expect(clone(emptyArr)).toEqual([])
	})

	// Optional: Demonstrate behavior with custom class instances
	it('should not preserve class prototype information', () => {
		class Person {
			constructor(public name: string) {}
		}

		const alice = new Person('Alice')
		const cloned = clone(alice)

		// After JSON parse/stringify, the prototype is lost
		expect(cloned).toEqual({ name: 'Alice' })
		expect(cloned).not.toBeInstanceOf(Person)
	})

	// -----------------------------------------
	// Vue-specific tests
	// -----------------------------------------

	it('should clone a ref as a plain object with a "value" property', () => {
		// If we pass a ref directly to JSON, it sees the shape { value: X, ...reactiveFlags... }
		const count = ref(10)
		const cloned = clone(count)

		// After JSON parse/stringify, reactivity flags are dropped
		// We just get { value: 10 } as a plain object.
		expect(isRef(cloned)).toBe(false) // It's no longer a Vue ref
		expect(cloned).toEqual(10)
	})

	it('should clone a reactive object into a plain object', () => {
		const original = reactive({ foo: 1, nested: { bar: 2 } })
		expect(isReactive(original)).toBe(true)

		const cloned = clone(original)
		// The reactivity is lost, but the plain data should remain
		expect(isReactive(cloned)).toBe(false)
		expect(cloned).toEqual({ foo: 1, nested: { bar: 2 } })
	})

	it('should clone a nested reactive structure as plain data', () => {
		const state = reactive({
			user: reactive({
				name: 'Alice',
				age: 25
			}),
			isActive: ref(true)
		})

		const cloned = clone(state)
		// The result is a plain object, without Vue reactivity
		expect(isReactive(cloned)).toBe(false)
		expect(cloned).toEqual({
			user: {
				name: 'Alice',
				age: 25
			},
			isActive: true
		})
	})

	// Optional: if you have a computed property, it’s essentially a function + ref
	// This test shows that computed properties won't survive JSON serialization.
	it('should drop computed properties (functions) when cloning a reactive object', () => {
		// A naive example: a computed is basically an internal getter function + a cached ref
		// For instance, in real code: const doubled = computed(() => count.value * 2)
		const computedLike = {
			effect: () => 42, // a function
			value: 42,
			__v_isRef: true // a naive marker for Vue ref
		}
		const reactiveObj = reactive({ computedLike })

		const cloned = clone(reactiveObj)
		// The 'computedLike' gets turned into a plain object with only serializable fields
		// The function is dropped
		expect(cloned).toEqual({
			computedLike: 42
		})
	})
})
