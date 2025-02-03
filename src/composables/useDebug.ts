import { ref } from 'vue'
import { toastController } from '@ionic/vue'

const isDebug = ref<boolean>(false)
const debugClickCounter = ref<number>(5)

function useDebug() {
	function enableDebugMode() {
		if (isDebug.value) {
			return
		}

		if (--debugClickCounter.value > 0) {
			return
		}

		isDebug.value = true
		toastController
			.create({
				message: 'Debug mode enabled',
				duration: 2000,
				position: 'bottom'
			})
			.then(toast => toast.present())
	}

	function debug(message: string, ...args: unknown[]) {
		if (!isDebug.value) {
			return
		}
		console.debug(message, ...args)
	}

	return {
		isDebug,
		debug,
		enableDebugMode
	}
}

export default useDebug
