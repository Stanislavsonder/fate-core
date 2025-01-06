import { onMounted, ref } from 'vue'

const hasMotionPermission = ref<boolean>(false)

export default function usePermission() {
	async function requestMotionPermission(): Promise<boolean> {
		// @ts-expect-error Method can not exist on some devices and permission isn't necessary.
		if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
			try {
				// @ts-expect-error Method can not exist on some devices and permission isn't necessary.
				const result = await DeviceMotionEvent.requestPermission()
				hasMotionPermission.value = result === 'granted'
				return hasMotionPermission.value
				// eslint-disable-next-line
			} catch (error) {
				hasMotionPermission.value = false
				return hasMotionPermission.value
			}
		} else {
			console.error('DeviceMotionEvent.requestPermission not available')
			hasMotionPermission.value = true
			return hasMotionPermission.value
		}
	}

	onMounted(async () => {
		await requestMotionPermission()
	})

	return {
		hasMotionPermission,
		requestMotionPermission
	}
}
