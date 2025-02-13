"use client";

import { FakeBook } from "@/app/books/actions";
import { useState } from "react";
import Link from "next/link";

type BookPaginationProps = {
  firstPageData: FakeBook[];
};

const BookPagination = ({ firstPageData }: BookPaginationProps) => {
  const [data, setData] = useState<FakeBook[]>(firstPageData);

  return (
    <div className="h-lvh">
      {/* 검색 */}
      <div className="flex h-[82px]">
        <div className="flex flex-col w-[calc(100%-64px)]">
          <input
            type="text"
            name=""
            id=""
            className="p-2"
            placeholder="제목..."
          />
          <div className="h-[2px] bg-gray-800" />
          <input
            type="text"
            name=""
            id=""
            className="p-2"
            placeholder="저자..."
          />
        </div>
        <div className="bg-green-600 font-bold text-white w-16 flex justify-center items-center">
          검색
        </div>
      </div>

      {/* 책 리스트*/}
      <ul className="h-[calc(100%-122px)]">
        {data.map((book) => (
          <li key={book.id} className="h-[10%] flex">
            <Link
              href={`/books/${book.id}`}
              className="w-full flex items-center"
            >
              <span className="w-[calc(100%-96px)] flex font-extrabold px-4">
                {book.title}
              </span>
              <span className="w-24 border-l-2 flex h-full items-center justify-center border-white">
                {book.author}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 네비게이터 */}
      <div className="h-10">navigator</div>
    </div>
  );
};

export default BookPagination;
