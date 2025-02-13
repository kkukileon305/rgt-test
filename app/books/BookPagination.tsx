"use client";

import { FakeBook, getBooksWithPagination } from "@/app/books/actions";
import { FormEventHandler, useEffect, useState } from "react";
import Link from "next/link";

type BookPaginationProps = {
  firstPageData: FakeBook[];
};

const BookPagination = ({ firstPageData }: BookPaginationProps) => {
  const [data, setData] = useState<FakeBook[]>(firstPageData);
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;

    // 일관성을 위해 제목이나 저자를 변경시 page 초기화
    setPage(0);

    setAuthor(target.author.value);
    setTitle(target.bookTitle.value);
  };

  useEffect(() => {
    (async () => {
      const newData = await getBooksWithPagination({
        page,
        size: 10,
        title: title ? title : undefined,
        author: author ? author : undefined,
      });

      setData(newData);
    })();
  }, [page, title, author]);

  return (
    <div className="h-lvh">
      {/* 검색 */}
      <form onSubmit={onSubmit} className="flex h-[82px]">
        <div className="flex flex-col w-[calc(100%-64px)]">
          <input
            type="text"
            id="bookTitle"
            className="p-2"
            placeholder="제목..."
          />
          <div className="h-[2px] bg-gray-800" />
          <input
            type="text"
            id="author"
            className="p-2"
            placeholder="저자..."
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 font-bold text-white w-16 flex justify-center items-center"
        >
          검색
        </button>
      </form>

      {/* 책 리스트*/}
      <ul className="h-[calc(100%-122px)]">
        {data.map((book) => (
          <li key={book.id} className="h-[10%] flex">
            <Link
              href={`/books/${book.id}`}
              className="w-full flex items-center"
            >
              <span className="w-[calc(100%-128px)] flex font-extrabold px-4">
                {book.title}
              </span>
              <span className="w-32 border-l-2 text-center text-sm flex h-full items-center justify-center border-white">
                {book.author}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 네비게이터 */}
      <div className="h-10">
        <button onClick={() => setPage((p) => p + 1)}>+1</button>
      </div>
    </div>
  );
};

export default BookPagination;
