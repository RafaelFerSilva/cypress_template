import { User, ApiHeaders, TokenResponse, BooksResponse, Book } from './types';

const DEMOQA_URL = 'https://demoqa.com';

const ENDPOINTS = {
  CREATE_ACCOUNT: `${DEMOQA_URL}/Account/v1/User`,
  GENERATE_TOKEN: `${DEMOQA_URL}/Account/v1/GenerateToken`,
  USER_AUTHORIZED: `${DEMOQA_URL}/Account/v1/Authorized`,
  DELETE_USER: `${DEMOQA_URL}/Account/v1/User/`,
  LIST_BOOKS: `${DEMOQA_URL}/BookStore/v1/Books`,
  LIST_BOOKS_ISBN: `${DEMOQA_URL}/BookStore/v1/Book?ISBN=`
};

export const getHeaders = (token?: string): ApiHeaders => {
  const headers: ApiHeaders = {
    accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Cria uma conta de usuário
 * @param user Dados do usuário (userName, password)
 * @returns Resposta da API com userId
 */
export const createUserAccount = (user: User): Cypress.Chainable<Cypress.Response<any>> => {
  return cy.api({
    method: 'POST',
    url: ENDPOINTS.CREATE_ACCOUNT,
    headers: getHeaders(),
    body: user,
    failOnStatusCode: false // Para capturar status 201
  });
};

/**
 * Gera um token para o usuário
 * @param user Dados do usuário (userName, password)
 * @returns Resposta da API com token
 */
export const generateUserToken = (user: User): Cypress.Chainable<Cypress.Response<TokenResponse>> => {
  return cy.api({
    method: 'POST',
    url: ENDPOINTS.GENERATE_TOKEN,
    headers: getHeaders(),
    body: user
  });
};

/**
 * Verifica se o usuário está autorizado
 * @param user Dados do usuário (userName, password)
 * @returns Resposta da API com status de autorização
 */
export const checkUserAuthorized = (user: User): Cypress.Chainable<Cypress.Response<boolean>> => {
  return cy.api({
    method: 'POST',
    url: ENDPOINTS.USER_AUTHORIZED,
    headers: getHeaders(),
    body: user
  });
};

/**
 * Lista todos os livros disponíveis
 * @returns Resposta da API com lista de livros
 */
export const listAllBooks = (): Cypress.Chainable<Cypress.Response<BooksResponse>> => {
  return cy.api({
    method: 'GET',
    url: ENDPOINTS.LIST_BOOKS,
    headers: getHeaders()
  });
};

/**
 * Busca um livro pelo ISBN
 * @param isbn ISBN do livro
 * @returns Resposta da API com detalhes do livro
 */
export const getBookByISBN = (isbn: string): Cypress.Chainable<Cypress.Response<Book>> => {
  return cy.api({
    method: 'GET',
    url: `${ENDPOINTS.LIST_BOOKS_ISBN}${isbn}`,
    headers: getHeaders()
  });
};

/**
 * Deleta um usuário
 * @param userId ID do usuário
 * @param token Token de autenticação
 * @returns Resposta da API
 */
export const deleteUser = (userId: string, token: string): Cypress.Chainable<Cypress.Response<any>> => {
  return cy.api({
    method: 'DELETE',
    url: `${ENDPOINTS.DELETE_USER}${userId}`,
    headers: getHeaders(token),
    failOnStatusCode: false
  });
};
