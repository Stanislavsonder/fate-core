// This array is used to determine if a character structure needs to be updated
const CHARACTER_BREAKING_CHANGE_VERSIONS = ['1.0.0'] as const

function isCharacterNeedsUpdate<T extends { _version?: string }>(character: T): boolean {
	if (!character._version) {
		return false
	}

	const [characterMajor, characterMinor, characterPatch] = character._version.split('.').map(Number)

	for (const breakingChangeVersion of CHARACTER_BREAKING_CHANGE_VERSIONS.toReversed()) {
		const [major, minor, patch] = breakingChangeVersion.split('.').map(Number)

		if (major > characterMajor) {
			return true
		}

		if (major === characterMajor && minor > characterMinor) {
			return true
		}

		if (major === characterMajor && minor === characterMinor && patch > characterPatch) {
			return true
		}
	}

	return false
}

export { isCharacterNeedsUpdate }
