/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import character from '@/tests/e2e/fixtures/character.json'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			acceptPrivacyPolicy(): Chainable<void>
			createTestCharacter(): Chainable<void>
		}
	}
}

Cypress.Commands.add('acceptPrivacyPolicy', () => {
	cy.window().then(win => {
		win.localStorage.setItem('privacyPolicyAcceptanceDate', new Date().toISOString())
		win.localStorage.setItem('privacyPolicyVersionDate', '2024-01-14')
	})
})

Cypress.Commands.add('createTestCharacter', () => {
	cy.get('[data-testid="create-character-button"]').click()
	cy.url().should('include', '/tabs/character/create')

	// Set name
	cy.get('[data-testid="character-name-input"]').type(character.name)

	// Select default modules
	cy.contains('FATE: Core skills').closest('[data-testid="module-list-item"]').find('[data-testid="module-checkbox"]').click()

	cy.contains('FATE: Core Stress').closest('[data-testid="module-list-item"]').find('[data-testid="module-checkbox"]').click()

	// Create
	cy.get('[data-testid="create-character-form-button"]').click()
})
