import type { FateConstants } from '@/types'
import TokenIcon from '@/assets/icons/Token.svg'

const constants: Pick<FateConstants, 'MAX_TOKENS' | 'DEFAULT_TOKENS' | 'TOKEN_ICON'> = {
	MAX_TOKENS: 9,
	DEFAULT_TOKENS: 3,
	TOKEN_ICON: TokenIcon
}

export default constants
