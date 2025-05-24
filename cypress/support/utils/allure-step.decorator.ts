export function AllureStep(stepName?: string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> | void {
    if (!descriptor) {
      // Decorador aplicado em algo que não é método de instância
      // Apenas retorna sem modificar nada
      console.warn(`@AllureStep: Decorador aplicado em algo que não é método: ${propertyKey}`);
      return;
    }

    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      console.warn(`@AllureStep: Decorador aplicado em algo que não é função: ${propertyKey}`);
      return descriptor;
    }

    descriptor.value = function (...args: any[]) {
      const name = stepName || `${propertyKey} ${args.join(', ')}`.trim();
      cy.allure().startStep(name);

      try {
        const result = originalMethod.apply(this, args);
        cy.then(() => {
          cy.allure().endStep();
        });
        return result;
      } catch (error) {
        cy.allure().endStep();
        throw error;
      }
    };

    return descriptor;
  };
}
