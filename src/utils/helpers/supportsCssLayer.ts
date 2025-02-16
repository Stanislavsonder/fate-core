/**
 * Checks if the current browser supports CSS Layers.
 *
 * This function creates a style element with a CSS Layer rule and appends it to the document head.
 * It then checks if the rule is recognized by the browser by inspecting the CSS rules of the style sheet.
 * Finally, it removes the style element from the document head.
 */
export function supportsCssLayer(): boolean {
	try {
		const style = document.createElement('style')
		style.textContent = '@layer test { .probe { color: red; } }'
		document.head.appendChild(style)

		const sheet = style.sheet
		const rules = sheet ? sheet.cssRules : []

		document.head.removeChild(style)

		if (rules.length > 0) {
			if (typeof CSSLayerBlockRule !== 'undefined' && rules[0] instanceof CSSLayerBlockRule) {
				return true
			}
			if (rules[0].cssText.trim().startsWith('@layer')) {
				return true
			}
		}
		return false
	} catch (error: unknown) {
		console.error('An error occurred while checking for CSS Layer support.', error)
		return false
	}
}
