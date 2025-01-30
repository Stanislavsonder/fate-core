import { getPlatforms } from '@ionic/vue'

const platforms = getPlatforms()

export const isAndroid = platforms.includes('android')
export const isIos = platforms.includes('ios')
