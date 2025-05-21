describe('Test DB', () => {
  it('executa script SQL', () => {
    cy.dbExecuteScript('cypress/sql/test.sql');
  });

  it('executa script com replace', () => {
    cy.dbReplaceAndExecute('cypress/sql/users_replace.sql', ['users', 1]);
  });
});