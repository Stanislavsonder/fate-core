import { Dialog } from '@capacitor/dialog'
import i18n from '@/i18n'
const { t } = i18n.global

export async function confirmRemove(name?: string): Promise<boolean> {
	const { value } = await Dialog.confirm({
		title: t('common.actions.confirm'),
		message: name ? t('common.messages.remove-named', { value: name }) : t('common.messages.remove'),
		okButtonTitle: t('common.actions.remove'),
		cancelButtonTitle: t('common.actions.cancel')
	})
	return value
}
