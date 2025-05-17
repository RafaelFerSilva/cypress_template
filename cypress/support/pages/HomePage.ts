export default class HomePage {
  visitHomePage() {
    cy.allure().logStep('Visit Home Page');
    cy.visit('https://demoqa.com/');
  }

  validateHomePageLoaded() {
    cy.allure().logStep('Validate home page is loaded successfully');
    cy.get('header img[src="/images/Toolsqa.jpg"]', { timeout: 10000 })
    .should('be.visible')
  }
}
