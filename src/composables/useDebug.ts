import { showInfoToast } from '@/utils/helpers/toast'
import { ref } from 'vue'

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
		showInfoToast('debug.enabled')
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
