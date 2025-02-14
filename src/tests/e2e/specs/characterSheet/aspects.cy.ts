import character from '@/tests/e2e/fixtures/character.json'
import { CharacterAspectType } from '@/modules/sonder@core-aspects/src/types'

describe('Aspects', () => {
	beforeEach(() => {
		cy.acceptPrivacyPolicy()
		cy.visit('/tabs/character')
		cy.createTestCharacter()
	})

	it('Test aspects', () => {
		// Add aspect
		for (const aspect of character.aspects) {
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
		}

		// Remove first aspect
		cy.on('uncaught:exception', () => false)
		cy.get('[data-testid="edit-aspect-button"]').first().click()
		cy.get('[data-testid="remove-aspect-button"]').click()
		cy.get('[data-testid="aspects-list"]').contains(character.aspects[0].name).should('not.exist')

		// Edit last aspect
		cy.get('[data-testid="edit-aspect-button"]').last().click()
		const newName = 'New name'
		const newDescription = 'New description'
		const newType = CharacterAspectType.HighConcept
		cy.get('[data-testid="aspect-name-input"]').type('{selectall}{backspace}')
		cy.get('[data-testid="aspect-name-input"]').type(newName)
		cy.get('[data-testid="aspect-description-input"]').type('{selectall}{backspace}')
		cy.get('[data-testid="aspect-description-input"]').type(newDescription)
		const index = Object.values(CharacterAspectType).indexOf(newType)
		cy.get('[data-testid="aspect-type-select"]').click()
		cy.get('.select-interface-option').eq(index).click()
		cy.get('.alert-button:not(.alert-button-role-cancel)').click()

		cy.get('[data-testid="save-aspect-button"]').click()

		// Check if aspect is edited
		cy.get('[data-testid="aspects-list"]').contains(newName).should('exist')
	})
})
