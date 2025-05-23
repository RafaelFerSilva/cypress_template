export interface User {
  userName: string;
  password: string;
  userId?: string;
}

export interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

export interface TokenResponse {
  token: string;
  expires: string;
  status: string;
  result: string;
}

export interface BooksResponse {
  books: Book[];
}

export interface ApiHeaders {
  accept: string;
  'Content-Type': string;
  Authorization?: string;
}
