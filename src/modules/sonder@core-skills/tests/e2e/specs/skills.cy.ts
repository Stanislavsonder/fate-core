describe('Skills', () => {
	beforeEach(() => {
		cy.acceptPrivacyPolicy()
		cy.visit('/tabs/character')
	})

	it('Test skills', () => {
		cy.createTestCharacter()
		const skills = ['Craft', 'Fight', 'Shoot']
		// Add skill
		cy.get('[data-testid="open-skills-modal"]').click()
		for (const skill of skills) {
			cy.get('[data-testid="add-skill-button"]').contains(skill).click()
		}
		cy.get('.button.in-toolbar.in-buttons:not([data-testid="character-list-button"])').click()

		// Check if skill is added
		for (const skill of skills) {
			cy.get('[data-testid="open-skill-button"]').contains(skill).should('exist')
		}

		// Open and check
		cy.get('[data-testid="open-skill-button"]').first().click()
		cy.get('[data-testid="skill-level"]').contains('1').should('exist')
		cy.get('[data-testid="level-up-button"]').click()
		cy.get('[data-testid="level-up-button"]').click()
		cy.get('[data-testid="level-up-button"]').click()
		cy.get('[data-testid="skill-level"]').contains('4').should('exist')
		cy.get('[data-testid="level-down-button"]').click()
		cy.get('[data-testid="skill-level"]').contains('3').should('exist')
		cy.get('[data-testid="level-down-button"]').click()
		cy.get('[data-testid="level-down-button"]').click()
		cy.get('[data-testid="level-down-button"]').should('have.attr', 'disabled')
		cy.get('[data-testid="skill-level"]').contains('1').should('exist')
		cy.get('[data-testid="level-up-button"]').click()
		cy.get('[data-testid="save-skill-button"]').click()
		cy.get('[data-testid="open-skill-button"]').first().click()
		cy.get('[data-testid="skill-level"]').contains('2').should('exist')

		// Remove skill
		cy.on('window:confirm', () => true)
		cy.get('[data-testid="remove-skill-button"]').click()

		// Check if skill is removed
		cy.get('[data-testid="open-skill-button"]').contains(skills[0]).should('not.exist')
	})
})
