import type { CharacterAspect } from '@/modules/sonder@core-aspects/src/types'
import { CharacterAspectType } from '@/modules/sonder@core-aspects/src/types'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			addAspect(aspect: CharacterAspect): Chainable<void>
			checkStressBox(type: string, index: number, force?: boolean): Chainable<void>
			stressExists(type: string, index: number): void
			openReconfigureWindow(name?: string): Chainable<void>
		}
	}
}

Cypress.Commands.add('openReconfigureWindow', (name?: string) => {
	cy.visit('/tabs/character/list')
	cy.get('ion-button[data-testid="character-select"][disabled]')
		.invoke('attr', 'data-testname')
		.then(testname => {
			const finalName = name ?? testname
			cy.get(`[data-testname="${finalName}"][data-testid="character-popover"]`).click()
			cy.get('[data-testid="character-configure"]').click()
		})
})

Cypress.Commands.add('addAspect', (aspect: CharacterAspect) => {
	cy.get('[data-testid="add-aspect-button"]').click()
	cy.get('[data-testid="aspect-name-input"]').type(aspect.name)
	cy.get('[data-testid="aspect-description-input"]').type(aspect.description)

	cy.get('[data-testid="aspect-type-select"]').click()
	const index = Object.values(CharacterAspectType).indexOf(aspect.type as CharacterAspectType)
	cy.get('.select-interface-option').eq(index).click()
	cy.get('.alert-button:not(.alert-button-role-cancel)').click()

	cy.get('[data-testid="save-aspect-button"]').click()

	// Check if aspect is added
	cy.get('[data-testid="aspects-list"]').contains(aspect.name).should('exist')
	cy.get('[data-testid="aspects-list"]').contains(aspect.description).should('exist')
})

Cypress.Commands.add('checkStressBox', (type: string, index: number, force?: boolean) => {
	cy.get(`[data-testname="${type}"] [data-testindex="${index - 1}"]`).click({ force })
})

Cypress.Commands.add('stressExists', (type: string, index: number) => {
	cy.get(`[data-testname="${type}"] [data-testindex="${index - 1}"] [data-testid="stress-box-checkmark"]`).should('exist')
})
