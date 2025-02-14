"use server";

import fakebooksInfo from "@/app/books/fakebooksInfo";

const fakeBooksDB: FakeBookDetail[] = [...fakebooksInfo];

// 단순 유틸함수
async function delay(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time / 100));
}

export type FakeBook = {
  id: number;
  title: string;
  author: string;
  count: number;
};

export type FakeBookDetail = FakeBook & {
  description: string;
  publishedYear: number;
  genre: string;
};

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
  inputOption: GetBookInputOption
): Promise<BookPaginationData> {
  await delay(1000);

  // 최신 상태의 데이터를 가져오기 위해 깊은 복사
  let filteredBooks = [...fakeBooksDB];
  const { title, author } = inputOption;

  if (title) {
    filteredBooks = filteredBooks.filter((book) => book.title.includes(title));
  }
  if (author) {
    filteredBooks = filteredBooks.filter((book) =>
      book.author.includes(author)
    );
  }

  const start = inputOption.page * inputOption.size;
  const end = start + inputOption.size;

  return {
    data: filteredBooks.slice(start, end),
    count: filteredBooks.length,
  };
}

export async function getBookDetail(
  id: number
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
  count: number;
};

export async function addBook(bookInput: AddBookInput) {
  // id는 시간ms으로 생성
  const id = Date.now();

  await delay(1000);

  fakeBooksDB.push({
    id,
    ...bookInput,
  });
  return;
}

type UpdateBookInput = {
  id: number;
  count: number;
};

export async function updateBook({ id, count }: UpdateBookInput) {
  const index = fakeBooksDB.findIndex((book) => book.id === id);

  fakeBooksDB[index] = { ...fakeBooksDB[index], count };
  return;
}
