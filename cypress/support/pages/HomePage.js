export default class HomePage {
  visitHomePage() {
    cy.allure().step('Visit Home Page');
    cy.visit('https://demoqa.com/');
  }

  validateHomePageLoaded() {
    cy.allure().step('Validate home page is loaded successfully');
    cy.get('header img[src="/images/Toolsqa.jpg"]', { timeout: 10000 })
    .should('be.visible')
  }
}
