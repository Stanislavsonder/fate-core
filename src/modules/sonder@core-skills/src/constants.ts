import type { FateConstants } from '@/types'
import icons from './assets/icons'

export default {
	MIN_SKILL_LEVEL: 1,
	MAX_SKILL_LEVEL: 10,
	SKILL_USAGE_ICON: {
		overcome: icons.OvercomeIcon,
		advantage: icons.AdvantageIcon,
		attack: icons.AttackIcon,
		defend: icons.DefendIcon
	}
} as FateConstants
