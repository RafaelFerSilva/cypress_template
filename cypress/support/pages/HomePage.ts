import { AllureStep } from '../utils/allure-step.decorator';

export default class HomePage {
  @AllureStep()
  visitHomePage() {
    cy.visit('/');
  }

  @AllureStep('Validate Home Page Loaded')
  validateHomePageLoaded() {
    cy.get('header img[src="/images/Toolsqa.jpg"]', { timeout: 10000 })
    .should('be.visible')
  }
}
