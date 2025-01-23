import { createI18n } from 'vue-i18n'
import { installModulesTranslation } from '@/modules/utils/installTranslation'
import Modules from '@/modules'

import en from './locales/en.json' with { type: 'json' }
import fr from './locales/fr.json' with { type: 'json' }
import es from './locales/es.json' with { type: 'json' }
import it from './locales/it.json' with { type: 'json' }
import pt from './locales/pt.json' with { type: 'json' }
import de from './locales/de.json' with { type: 'json' }
import nl from './locales/nl.json' with { type: 'json' }
import sv from './locales/sv.json' with { type: 'json' }
import no from './locales/no.json' with { type: 'json' }
import da from './locales/da.json' with { type: 'json' }
import fi from './locales/fi.json' with { type: 'json' }
import ru from './locales/ru.json' with { type: 'json' }
import be from './locales/be.json' with { type: 'json' }
import uk from './locales/uk.json' with { type: 'json' }
import pl from './locales/pl.json' with { type: 'json' }
import cs from './locales/cs.json' with { type: 'json' }
import ro from './locales/ro.json' with { type: 'json' }
import el from './locales/el.json' with { type: 'json' }
import tr from './locales/tr.json' with { type: 'json' }
import he from './locales/he.json' with { type: 'json' }
import ar from './locales/ar.json' with { type: 'json' }
import fa from './locales/fa.json' with { type: 'json' }
import sw from './locales/sw.json' with { type: 'json' }
import zh from './locales/zh.json' with { type: 'json' }
import hi from './locales/hi.json' with { type: 'json' }
import bn from './locales/bn.json' with { type: 'json' }
import ja from './locales/ja.json' with { type: 'json' }
import ko from './locales/ko.json' with { type: 'json' }
import id from './locales/id.json' with { type: 'json' }
import th from './locales/th.json' with { type: 'json' }

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
