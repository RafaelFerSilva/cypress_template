describe('Test DB', () => {
  beforeEach(() => {
    cy.dbConnect();
  });

  afterEach(() => {
    cy.dbClose();
  });

  it('executa script SQL', () => {
    cy.dbExecuteScript('cypress/sql/test.sql');
  });

  it('executa script com replace', () => {
    cy.dbReplaceAndExecute('cypress/sql/users_replace.sql', ['users', 1]);
  });
});