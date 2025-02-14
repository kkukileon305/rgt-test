"use client";

import {
  BookPaginationData,
  getBooksWithPagination,
} from "@/app/books/actions";
import { FormEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

type BookPaginationProps = {
  firstPageData: BookPaginationData;
};

const BookPagination = ({ firstPageData }: BookPaginationProps) => {
  const [bookData, setBookData] = useState<BookPaginationData>(firstPageData);
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 네이게이터 페이지
  const totalPages = Math.ceil(bookData.count / 10);
  const pages = Array.from({ length: totalPages }, (_, i) => i);

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
      setIsLoading(true);
      const newData = await getBooksWithPagination({
        page,
        size: 10,
        title: title ? title : undefined,
        author: author ? author : undefined,
      });

      setIsLoading(false);
      setBookData(newData);
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
      <div className="h-[calc(100%-122px)]">
        {!isLoading && (
          <ul className="h-full">
            {bookData.data.map((book) => (
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
        )}

        {isLoading && (
          <div className="h-full flex justify-center items-center">
            <ImSpinner8 className="animate-spin" size={40} />
          </div>
        )}
      </div>

      {/* 네비게이터 */}
      <div className="h-10 flex justify-center items-center border-t border-white">
        {!isLoading && (
          <div className="flex gap-4">
            <button
              className="disabled:invisible"
              disabled={page <= 0}
              onClick={() => {
                // page 변경후 useEffect안에서 loading상태를 변경하면 깜빡이는 ui가 되서
                // loading과 page를 함께 변경하도록 함
                setIsLoading(true);
                setPage(page - 1);
              }}
            >
              <FaArrowCircleLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((p) => (
                <button
                  key={p}
                  className={`text-gray-400 ${
                    page === p && "font-bold text-blue-600"
                  }`}
                  onClick={() => {
                    setIsLoading(true);
                    setPage(p);
                  }}
                  disabled={page === p}
                >
                  {p + 1}
                </button>
              ))}
            </div>

            <button
              className="disabled:invisible"
              onClick={() => {
                setIsLoading(true);
                setPage(page + 1);
              }}
              disabled={page >= totalPages - 1}
            >
              <FaArrowCircleRight size={24} />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-8">
            <ImSpinner8 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPagination;
