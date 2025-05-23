import { faker } from '@faker-js/faker';
import { User } from '../api/types';

/**
 * Cria dados de usuário fake para testes
 * @returns Objeto com userName e password aleatórios
 */
export function createFakeUser(): User {
  return {
    userName: faker.internet.userName(),
    password: faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z0-9]/,
      prefix: '!Aa1'
    })
  };
}

/**
 * Gera um ISBN fake (apenas para exemplo)
 * @returns String com formato de ISBN
 */
export function createFakeISBN(): string {
  return faker.string.numeric(13);
}
