describe('Startup page', () => {
	it('Startup page on first launch should be a Privacy Page', () => {
		cy.visit('/')
		cy.get('[data-testid="privacy-policy-content"]').should('exist').and('not.be.empty')
	})

	it('Language switcher should work', () => {
		cy.visit('/')
		// Checking the language switch button
		cy.get('[data-testid="language-change-policy-trigger"]').should('exist')
		cy.get('[data-testid="language-change-policy-trigger"]').click()

		// Language list contains more than 30 items
		cy.get('[data-testid="language-change-policy-popover"]').should('exist')
		cy.get('[data-testid="language-change-policy-popover"] ion-item').should('have.length.gte', 30)

		// Change language to Russian
		cy.get('[data-testid="language-change-policy-popover"] ion-item').contains('Русский').click()
		cy.get('[data-testid="privacy-policy-content"]').contains('Политика конфиденциальности').should('exist')

		// Change language to English
		cy.get('[data-testid="language-change-policy-trigger"]').click()
		cy.get('[data-testid="language-change-policy-popover"] ion-item').contains('English').click()
	})

	it('Accepting the policy should redirect to the character page', () => {
		cy.visit('/')
		// Accept the policy and check redirection
		cy.get('[data-testid="accept-policy-button"]').click()
		cy.url().should('include', '/tabs/character')

		cy.window().then(win => {
			expect(win.localStorage.getItem('privacyPolicyAcceptanceDate')).to.exist
			expect(win.localStorage.getItem('privacyPolicyVersionDate')).to.equal('2024-01-14')
		})
	})
})
