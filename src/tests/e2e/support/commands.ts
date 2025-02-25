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
import './core'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			acceptPrivacyPolicy(): Chainable<void>
			createTestCharacter(): Chainable<void>
			removeAllCharacters(): Chainable<void>
		}
	}
}

Cypress.Commands.add('acceptPrivacyPolicy', () => {
	cy.window().then(win => {
		win.localStorage.setItem('privacyPolicyAcceptanceDate', new Date().toISOString())
		win.localStorage.setItem('privacyPolicyVersionDate', '2024-01-14')
	})
})

Cypress.Commands.add('removeAllCharacters', () => {
	cy.window().then(win => {
		const request = win.indexedDB.deleteDatabase('CharactersDatabase')
		request.onsuccess = function () {
			console.log('Database deleted successfully')
		}
	})
})

Cypress.Commands.add('createTestCharacter', () => {
	cy.get('[data-testid="create-character-button"]').click()
	cy.url().should('include', '/tabs/character/create')

	// Set name
	cy.get('[data-testid="character-name-input"]').type(character.name)

	// Create
	cy.get('[data-testid="create-character-form-button"]').click()
})
