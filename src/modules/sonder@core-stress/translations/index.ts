import manifest from '../manifest.json' with { type: 'json' }
import { signTranslations } from '@/modules/utils/localizationSigners'

import en from './en.json' with { type: 'json' }
import fr from './fr.json' with { type: 'json' }
import es from './es.json' with { type: 'json' }
import pt from './pt.json' with { type: 'json' }
import it from './it.json' with { type: 'json' }
import de from './de.json' with { type: 'json' }
import nl from './nl.json' with { type: 'json' }
import sv from './sv.json' with { type: 'json' }
import no from './no.json' with { type: 'json' }
import da from './da.json' with { type: 'json' }
import fi from './fi.json' with { type: 'json' }
import ru from './ru.json' with { type: 'json' }
import be from './be.json' with { type: 'json' }
import uk from './uk.json' with { type: 'json' }
import pl from './pl.json' with { type: 'json' }
import cs from './cs.json' with { type: 'json' }
import ro from './ro.json' with { type: 'json' }
import el from './el.json' with { type: 'json' }
import tr from './tr.json' with { type: 'json' }
import he from './he.json' with { type: 'json' }
import ar from './ar.json' with { type: 'json' }
import fa from './fa.json' with { type: 'json' }
import sw from './sw.json' with { type: 'json' }
import zh from './zh.json' with { type: 'json' }
import hi from './hi.json' with { type: 'json' }
import bn from './bn.json' with { type: 'json' }
import ja from './ja.json' with { type: 'json' }
import ko from './ko.json' with { type: 'json' }
import id from './id.json' with { type: 'json' }
import th from './th.json' with { type: 'json' }

// prettier-ignore
export default signTranslations({
	en,		fr,		es,		pt,		it,
	de,		nl,		sv,		no,		da,
	fi,		ru,		be,		uk,		pl,
	cs,		ro,		el,		tr,		he,
	ar,		fa,		sw,		zh,		hi,
	bn,		ja,		ko,		id,		th
},	manifest.id)
