import { onBeforeUnmount, ShallowRef, watch } from 'vue'

function useModal(openMarker: ShallowRef<boolean>) {
	onBeforeUnmount(() => {
		act(false)
	})

	watch(openMarker, act)

	function act(isOpen: boolean) {
		if (isOpen) {
			addModalAttributes()
		} else {
			removeModalAttributes()
		}
	}

	function addModalAttributes() {
		const app = document.getElementById('app')
		if (app) {
			app.inert = true
			document.body.classList.add('overflow-hidden')
		}
	}

	function removeModalAttributes() {
		const app = document.getElementById('app')
		if (app) {
			app.inert = false
			document.body.classList.remove('overflow-hidden')
		}
	}
}

export default useModal
