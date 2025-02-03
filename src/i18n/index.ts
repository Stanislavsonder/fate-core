import { createI18n } from 'vue-i18n'
import { installModulesTranslation } from '@/modules/utils/installTranslation'
import Modules from '@/modules'

import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import it from './locales/it.json'
import pt from './locales/pt.json'
import de from './locales/de.json'
import nl from './locales/nl.json'
import sv from './locales/sv.json'
import no from './locales/no.json'
import da from './locales/da.json'
import fi from './locales/fi.json'
import ru from './locales/ru.json'
import be from './locales/be.json'
import uk from './locales/uk.json'
import pl from './locales/pl.json'
import cs from './locales/cs.json'
import ro from './locales/ro.json'
import el from './locales/el.json'
import tr from './locales/tr.json'
import he from './locales/he.json'
import ar from './locales/ar.json'
import fa from './locales/fa.json'
import sw from './locales/sw.json'
import zh from './locales/zh.json'
import hi from './locales/hi.json'
import bn from './locales/bn.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import id from './locales/id.json'
import th from './locales/th.json'

// prettier-ignore
export const AVAILABLE_LANGUAGES = [
	'en',	'fr',	'es',	'pt',	'it',
	'de',	'nl',	'sv',	'no',	'da',
	'fi',	'ru',	'be',	'uk',	'pl',
	'cs',	'ro',	'el',	'tr',	'he',
	'ar',	'fa',	'sw',	'zh',	'hi',
	'bn',	'ja',	'ko',	'id',	'th'
]

const i18n = createI18n({
	locale: localStorage.getItem('locale') || navigator.language.slice(0, 2),
	fallbackLocale: 'en',
	legacy: false,
	// prettier-ignore
	messages: installModulesTranslation({
			en,			fr,			es,			pt,			it,
			de,			nl,			sv,			no,			da,
			fi,			ru,			be,			uk,			pl,
			cs,			ro,			el,			tr,			he,
			ar,			fa,			sw,			zh,			hi,
			bn,			ja,			ko,			id,			th
	}, Modules) as Record<string, Record<string, string>>
})

export default i18n
