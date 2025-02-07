import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'com.sonder.fate_core',
	appName: 'FATE: Core',
	webDir: 'dist',
	plugins: {
		StatusBar: {
			overlaysWebView: false
		}
	}
}

export default config
