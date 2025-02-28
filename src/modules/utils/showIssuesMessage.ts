import type { ModuleResolutionIssue } from './types'
import { showToast } from '@/utils/helpers/toast'
import i18n from '@/i18n'

const { t } = i18n.global

export function showIssuesMessage(issues: ModuleResolutionIssue[]) {
	let message = ''
	issues.forEach(issue => {
		let messageKey: string
		let params: Record<string, unknown> = {}

		switch (issue.type) {
			case 'missing-dependency':
				// Example: "Module 'X' is missing dependency 'Y'."
				messageKey = 'errors.moduleResolution.missingDependency'
				params = {
					module: issue.moduleName,
					dependency: issue.details.dependencyId
				}
				break
			case 'version-mismatch':
				// Example: "Module 'X' requires 'Y' version 'A', but found version 'B'."
				messageKey = 'errors.moduleResolution.versionMismatch'
				params = {
					module: issue.moduleName,
					dependency: issue.details.dependencyName,
					requiredVersion: issue.details.requiredVersion,
					actualVersion: issue.details.actualVersion
				}
				break
			case 'app-version-mismatch':
				// Example: "Module 'X' requires app version 'Y', but current version is 'Z'."
				messageKey = 'errors.moduleResolution.appVersionMismatch'
				params = {
					module: issue.moduleName,
					requiredAppVersion: issue.details.requiredAppVersion,
					currentAppVersion: issue.details.appVersion
				}
				break
			case 'incompatible-modules':
				// Example: "Module 'X' is incompatible with: A, B."
				messageKey = 'errors.moduleResolution.incompatibleModules'
				params = {
					module: issue.moduleName,
					incompatible: issue.details.incompatibleWith?.map(mod => mod.name).join(', ')
				}
				break
			case 'dependency-cycle':
				// Example: "A dependency cycle was detected involving: A, B, C."
				messageKey = 'errors.moduleResolution.dependencyCycle'
				params = {
					modules: issue.details.cycleModules?.map(mod => mod.name).join(', ')
				}
				break
			default:
				messageKey = 'errors.moduleResolution.genericError'
		}

		message += t(messageKey, params) + '\n'
	})

	message && showToast(message, 'danger')
}
