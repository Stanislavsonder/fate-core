import { unref } from 'vue'

/**
 * Deep-clones a given value using JSON.parse(JSON.stringify(...)), unwrapping
 * any Vue ref by calling `unref(value)` first. This effectively removes reactivity
 * and returns a plain data structure with identical (serializable) content.
 *
 * **Note:**
 * - Non-serializable values (functions, `undefined`, symbol keys, etc.) are dropped.
 * - Date objects become ISO8601 strings.
 * - Class instances lose their prototype information (become plain objects).
 * - Circular references cause a `TypeError`.
 *
 * @template T The type of the input value.
 * @param {T} value The value to clone. It may be a primitive, object, array, or Vue ref.
 * @returns {T} A new, deeply cloned structure (minus any reactivity).
 */
export function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(unref(value)))
}
