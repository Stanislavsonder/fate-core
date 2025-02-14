import character from '@/tests/e2e/fixtures/character.json'

describe('Character creation flow', () => {
	beforeEach(() => {
		cy.acceptPrivacyPolicy()
		cy.visit('/tabs/character')
	})

	it('By default character is not selected', () => {
		cy.get('[data-testid="character-not-selected"]').should('exist')
	})

	it('Create character and list buttons exists', () => {
		cy.get('[data-testid="create-character-button"]').should('exist')
		cy.get('[data-testid="character-list-button"]').should('exist')
	})

	it('Create character with default settings', () => {
		cy.createTestCharacter()

		cy.url().should('include', '/tabs/character')
		cy.get('[data-testid="character-not-selected"]').should('not.exist')
		cy.get('[data-testid="character-name-field"]').contains(character.name).should('exist')
	})
})
