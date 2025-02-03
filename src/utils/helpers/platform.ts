import { getPlatforms } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'

const platforms = getPlatforms()

export const isAndroid = platforms.includes('android')
export const isIos = platforms.includes('ios')
export const isWeb = platforms.includes('desktop') || Capacitor.getPlatform() === 'web'
