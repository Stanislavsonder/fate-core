import i18n from '@/i18n'
import { toastController } from '@ionic/vue'

const { t } = i18n.global

type ToastColor = 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'tertiary'

interface ToastItem {
	message: string
	color: ToastColor
	duration: number
}

const toastQueue: ToastItem[] = []
let isProcessingQueue = false

async function processToastQueue(): Promise<void> {
	if (isProcessingQueue || toastQueue.length === 0) {
		return
	}

	isProcessingQueue = true
	const { message, color, duration } = toastQueue.shift()!

	const toast = await toastController.create({
		message,
		duration,
		color,
		position: 'top'
	})

	await toast.present()

	setTimeout(() => {
		isProcessingQueue = false
		processToastQueue()
	}, duration + 100) // Add a small buffer between toasts
}

export async function showToast(message: string, color: ToastColor = 'primary', duration = 2000): Promise<void> {
	toastQueue.push({ message, color, duration })
	processToastQueue()
}

export async function showSuccessToast(messageKey: string, options: Record<string, unknown> = {}): Promise<void> {
	await showToast(t(messageKey, options), 'success')
}

export async function showErrorToast(messageKey: string, options: Record<string, unknown> = {}): Promise<void> {
	await showToast(t(messageKey, options), 'danger')
}

export async function showWarningToast(messageKey: string, options: Record<string, unknown> = {}): Promise<void> {
	await showToast(t(messageKey, options), 'warning')
}

export async function showInfoToast(messageKey: string, options: Record<string, unknown> = {}): Promise<void> {
	await showToast(t(messageKey, options), 'primary')
}
