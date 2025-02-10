import type { FateConstants } from '@/types'
import PositiveDiceIcon from '@/assets/icons/PositiveDice.svg'
import NegativeDiceIcon from '@/assets/icons/NegativeDice.svg'
import PlasterIcon from '@/assets/icons/Plaster.svg'
import StarIcon from '@/modules/sonder@inventory/src/assets/icons/Star.svg'
import { CharacterAspectType } from '@/modules/sonder@core-aspects/src/types'

const constants: Pick<FateConstants, 'ASPECT_ICONS'> = {
	ASPECT_ICONS: {
		[CharacterAspectType.HighConcept]: PositiveDiceIcon,
		[CharacterAspectType.Trouble]: NegativeDiceIcon,
		[CharacterAspectType.Consequence]: PlasterIcon,
		[CharacterAspectType.Milestone]: StarIcon,
		[CharacterAspectType.Other]: undefined
	}
}

export default constants
