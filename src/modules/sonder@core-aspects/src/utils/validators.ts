import i18n from '@/i18n'
import type { CharacterAspect } from '../types'
import { CharacterAspectType } from '../types'
const t = i18n.global.t

export function validateCharacterAspect(aspect: CharacterAspect): string | undefined {
	if (!aspect.name) {
		return t('sonder@core-stunts.errors.nameRequired')
	}

	if (!aspect.description) {
		return t('sonder@core-stunts.errors.descriptionRequired')
	}

	if (!Object.values(CharacterAspectType).includes(aspect.type)) {
		return t('sonder@core-stunts.errors.typeInvalid')
	}
}
