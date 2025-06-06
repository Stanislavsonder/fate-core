import SonderCoreIdentity from '@/modules/sonder@core-identity'
import SonderCoreSkills from '@/modules/sonder@core-skills'
import SonderCoreStress from '@/modules/sonder@core-stress'
import SonderNotebook from '@/modules/sonder@notebook'
import SonderInventory from '@/modules/sonder@inventory'
import SonderCoreStunts from '@/modules/sonder@core-stunts'
import SonderCoreTokens from '@/modules/sonder@core-tokens'
import SonderCoreAspects from '@/modules/sonder@core-aspects'
import SonderCoreConsequences from '@/modules/sonder@core-consequences'
import type { FateModuleManifest } from '@/modules/utils/types'

// prettier-ignore
const Modules = [
	SonderCoreIdentity,
	SonderCoreAspects,
	SonderCoreSkills,
	SonderCoreStunts,
	SonderCoreStress,
	SonderCoreConsequences,
	SonderCoreTokens,
	SonderNotebook,
	SonderInventory,
]

export default new Map(Modules.map(module => [module.id, module])) as Map<string, FateModuleManifest>
