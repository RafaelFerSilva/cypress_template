// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('dbConnect', () => {
  cy.allure().startStep('Connect to Database');
  cy.task('dbConnect').then((result: any) => {
    if (result.success) {
      cy.log('Database connected successfully');
    } else {
      cy.log(`Database connection failed: ${result.error}`);
      cy.allure().attachment('Error', result.error ?? 'Erro desconhecido', 'text/plain');
      throw new Error(result.error);
    }
    cy.allure().endStep();
  });
});

Cypress.Commands.add('dbClose', () => {
  cy.allure().startStep('Close Database Connection');
  cy.task('dbClose').then(() => {
    cy.allure().endStep();
  });
});

Cypress.Commands.add('dbExecuteScript', (scriptPath: string) => {
  cy.allure().startStep(`Execute SQL Script: ${scriptPath}`);
  cy.task('dbExecuteScript', { scriptPath }).then((result: any) => {
    if (result.success) {
      cy.allure().attachment('SQL Query', result.sql ?? '', 'text/plain');
      cy.allure().attachment('Query Results', JSON.stringify(result.rows, null, 2), 'application/json');
      expect(result.rows).to.be.an('array');
    } else {
      cy.log(`SQL execution failed: ${result.error}`);
      cy.allure().attachment('Error', result.error ?? 'Erro desconhecido', 'text/plain');
      throw new Error(result.error);
    }
    cy.allure().endStep();
  });
});

Cypress.Commands.add('dbReplaceAndExecute', (scriptPath: string, values: any[]) => {
  cy.allure().startStep(`Replace Values and Execute SQL Script: ${scriptPath}`);
  cy.task('dbReplaceAndExecute', { scriptPath, values }).then((result: any) => {
    if (result.success) {
      cy.allure().attachment('Modified SQL', result.modifiedSql ?? '', 'text/plain');
      cy.allure().attachment('Query Results', JSON.stringify(result.rows, null, 2), 'application/json');
      expect(result.rows).to.be.an('array');
    } else {
      cy.log(`SQL execution failed: ${result.error}`);
      cy.allure().attachment('Error', result.error ?? 'Erro desconhecido', 'text/plain');
      throw new Error(result.error);
    }
    cy.allure().endStep();
  });
});
