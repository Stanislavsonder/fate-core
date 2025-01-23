import manifest from '../manifest.json'
import { signTranslations } from '@/modules/utils/localizationSigners'

import en from './en.json'
import fr from './fr.json'
import es from './es.json'
import pt from './pt.json'
import it from './it.json'
import de from './de.json'
import nl from './nl.json'
import sv from './sv.json'
import no from './no.json'
import da from './da.json'
import fi from './fi.json'
import ru from './ru.json'
import be from './be.json'
import uk from './uk.json'
import pl from './pl.json'
import cs from './cs.json'
import ro from './ro.json'
import el from './el.json'
import tr from './tr.json'
import he from './he.json'
import ar from './ar.json'
import fa from './fa.json'
import sw from './sw.json'
import zh from './zh.json'
import hi from './hi.json'
import bn from './bn.json'
import ja from './ja.json'
import ko from './ko.json'
import id from './id.json'
import th from './th.json'

// prettier-ignore
export default signTranslations({
		en,		fr,		es,		pt,		it,
		de,		nl,		sv,		no,		da,
		fi,		ru,		be,		uk,		pl,
		cs,		ro,		el,		tr,		he,
		ar,		fa,		sw,		zh,		hi,
		bn,		ja,		ko,		id,		th
},	manifest.id)
