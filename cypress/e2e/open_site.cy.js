
describe('Home Page Test Suite', () => {
  it('Home page test', () => {
    cy.allure().step('Visit Home Page')
    cy.visit('https://demoqa.com/')
    
    cy.allure().step('Validate home page is loaded successfully')
    cy.get('header img[src="/images/Toolsqa.jpg"]', { timeout: 10000 })
    .should('be.visible')
  })
})