describe('Character module removal', () => {
	const characterName = 'Module Remove Test'

	beforeEach(() => {
		cy.removeAllCharacters()
		cy.acceptPrivacyPolicy()
		cy.visit('/tabs/character')
	})

	it('blocks removing a module that others depend on, then allows removal after the dependent is gone', () => {
		cy.get('[data-testid="create-character-button"]').click()
		cy.url().should('include', '/tabs/character/create')

		cy.get('[data-testid="character-name-input"]').type(characterName)
		cy.get('[data-testid="create-character-form-button"]').click()
		cy.url().should('include', '/tabs/character')

		cy.get('[data-testid="sheet-section"]').contains('Skills').should('exist')
		cy.get('[data-testid="sheet-section"]').contains('Stunts').should('exist')

		cy.openReconfigureWindow(characterName)
		cy.url().should('match', /\/tabs\/character\/configure\/\d+/)
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').should('exist')

		// Skills is locked while Stunts (which depends on it) is still selected
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').should('have.class', 'checkbox-disabled')
		cy.contains('Other module(s) depend on it').should('exist')

		// Attempting to uncheck Skills must not remove it
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').click({ force: true })
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').should('have.class', 'checkbox-checked')

		// Remove the dependent module first
		cy.get('ion-checkbox[data-testname="sonder@core-stunts"]').click()
		cy.get('ion-checkbox[data-testname="sonder@core-stunts"]').should('not.have.class', 'checkbox-checked')

		// Skills can now be removed
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').should('not.have.class', 'checkbox-disabled')
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').click()
		cy.get('ion-checkbox[data-testname="sonder@core-skills"]').should('not.have.class', 'checkbox-checked')

		cy.get('[data-testid="create-character-form-button"]').click()
		cy.url().should('include', '/tabs/character')
		cy.url().should('not.include', '/configure')

		cy.get('[data-testid="sheet-section"]').contains('Skills').should('not.exist')
		cy.get('[data-testid="sheet-section"]').contains('Stunts').should('not.exist')
	})
})
