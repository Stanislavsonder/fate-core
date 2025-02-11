import type { FateConstants } from '@/types'

const constants: Pick<FateConstants, 'MAX_AVATAR_FILE_SIZE'> = {
	MAX_AVATAR_FILE_SIZE: 5 * 1024 * 1024 // 5 MB
}

export default constants
