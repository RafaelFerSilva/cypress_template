declare namespace Cypress {
  interface Chainable<Subject = any> {
    dbConnect(): Chainable<void>;
    dbClose(): Chainable<void>;
    dbExecuteScript(scriptPath: string): Chainable<void>;
    dbReplaceAndExecute(scriptPath: string, values: any[]): Chainable<void>;
  }
}
