describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://demoqa.com/')
    cy.get('header img[src="/images/Toolsqa.jpg"]', { timeout: 10000 })
    .should('be.visible')
  })
})