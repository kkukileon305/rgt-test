"use server";

type FakeBook = {
  id: number;
  title: string;
  author: string;
};

type FakeBookDetail = FakeBook & {
  description: string;
  publishedYear: number;
  genre: string;
};

async function delay(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let fakeBooksDB: FakeBookDetail[] = Array.from({ length: 54 }, (_, i) => ({
  id: i,
  title: `${i}번째 책`,
  author: `${i}번째 작가`,
  description: `${i}번째 설명`,
  publishedYear: i + 1980,
  genre: "장르",
}));

type GetBookInputOption = {
  page: number;
  size: number;
  title?: string;
  author?: string;
};

export async function getBooksWithPagination(
  inputOption: GetBookInputOption
): Promise<FakeBook[]> {
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
      book.author.includes(author)
    );
  }

  return filteredBooks.slice(start, end).map((book) => ({
    id: book.id,
    author: book.author,
    title: book.title,
  }));
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
