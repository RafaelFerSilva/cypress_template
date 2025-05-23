import { createFakeUser } from '../support/utils/faker.utils';
import { 
  createUserAccount, 
  generateUserToken, 
  checkUserAuthorized, 
  listAllBooks, 
  getBookByISBN, 
  deleteUser 
} from '../support/api/bookstore.api';
import { User } from '../support/api/types';

describe('Book Store API', () => {
  // Dados de teste
  const testUser: User = createFakeUser();
  let userToken: string;
  
  // Dados de livro para validação
  const expectedBook = {
    isbn: '9781449365035',
    title: 'Speaking JavaScript',
    subTitle: 'An In-Depth Guide for Programmers',
    author: 'Axel Rauschmayer',
    publisher: 'O\'Reilly Media'
  };

  it('You must create a user', () => {
    createUserAccount(testUser).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.userID).to.be.a('string');
      
      // Salva o userId para uso posterior
      testUser.userId = response.body.userID;
    });
  });

  it('Must generate a token for the user', () => {
    generateUserToken(testUser).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.token).to.be.a('string');
      expect(response.body.expires).to.be.a('string');
      
      // Salva o token para uso posterior
      userToken = response.body.token;
    });
  });

  it('Must authorize the user', () => {
    checkUserAuthorized(testUser).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.true;
    });
  });

  it('Must list all books', () => {
    listAllBooks().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.books).to.be.an('array').that.is.not.empty;
      
      // Verifica se o livro esperado está na lista
      const foundBook = response.body.books.find(book => book.isbn === expectedBook.isbn);
      expect(foundBook).to.exist;
    });
  });

  it('You must search for a book by ISBN', () => {
    getBookByISBN(expectedBook.isbn).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.isbn).to.eq(expectedBook.isbn);
      expect(response.body.title).to.eq(expectedBook.title);
      expect(response.body.subTitle).to.eq(expectedBook.subTitle);
      expect(response.body.author).to.eq(expectedBook.author);
      expect(response.body.publisher).to.eq(expectedBook.publisher);
    });
  });

  // Limpeza - executado após todos os testes
  after(() => {
    // Só tenta deletar se tiver userId e token
    if (testUser.userId && userToken) {
      deleteUser(testUser.userId, userToken).then((response) => {
        expect([200, 204]).to.include(response.status);
      });
    }
  });
});
