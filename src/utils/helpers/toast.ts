import { toastController } from '@ionic/vue'
import i18n from '@/i18n'

const { t } = i18n.global

type ToastColor = 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'tertiary'

export async function showToast(message: string, color: ToastColor = 'primary', duration = 3000): Promise<void> {
	const toast = await toastController.create({
		message,
		duration,
		color,
		position: 'bottom'
	})
	await toast.present()
}

export async function showSuccessToast(messageKey: string): Promise<void> {
	await showToast(t(messageKey), 'success')
}

export async function showErrorToast(messageKey: string): Promise<void> {
	await showToast(t(messageKey), 'danger')
}

export async function showWarningToast(messageKey: string): Promise<void> {
	await showToast(t(messageKey), 'warning')
}
