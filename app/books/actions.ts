"use server";

import fakebooksInfo from "@/app/books/fakebooksInfo";

// 단순 유틸함수
async function delay(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time / 100));
}

export type FakeBook = {
  id: number;
  title: string;
  author: string;
};

export type FakeBookDetail = FakeBook & {
  description: string;
  publishedYear: number;
  genre: string;
};

let fakeBooksDB: FakeBookDetail[] = fakebooksInfo;

type GetBookInputOption = {
  page: number;
  size: number;
  title?: string;
  author?: string;
};

export type BookPaginationData = {
  data: FakeBook[];
  count: number;
};

export async function getBooksWithPagination(
  inputOption: GetBookInputOption,
): Promise<BookPaginationData> {
  const { page, size, title, author } = inputOption;
  const start = page * size;
  const end = start + size;

  await delay(1000);

  let filteredBooks = fakeBooksDB;

  if (title) {
    filteredBooks = filteredBooks.filter((book) => book.title.includes(title));
  }
  if (author) {
    filteredBooks = filteredBooks.filter((book) =>
      book.author.includes(author),
    );
  }

  return {
    data: filteredBooks.slice(start, end).map((book) => ({
      id: book.id,
      author: book.author,
      title: book.title,
    })),
    count: filteredBooks.length,
  };
}

export async function getBookDetail(
  id: number,
): Promise<FakeBookDetail | null> {
  const bookDetail = fakeBooksDB.find((book) => book.id === id);
  await delay(1000);
  return bookDetail ? bookDetail : null;
}

type AddBookInput = {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  genre: string;
};

export async function addBook(bookInput: AddBookInput) {
  // id는 시간ms으로 생성
  const id = Date.now();

  await delay(1000);

  fakeBooksDB = [
    ...fakeBooksDB,
    {
      id,
      ...bookInput,
    },
  ];

  return;
}

export async function deleteBook(bookId: number) {
  await delay(1000);

  // 사용자가 보이는 책을 선택해서 삭제하도록(직접 id입력하지 않음 => 없는 id가 갈 일이 없음)
  fakeBooksDB = fakeBooksDB.filter((book) => book.id !== bookId);

  return;
}
