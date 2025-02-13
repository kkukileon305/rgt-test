"use client";

import { FakeBook } from "@/app/books/actions";

type BookPaginationProps = {
  firstPageData: FakeBook[];
};

const BookPagination = ({ firstPageData }: BookPaginationProps) => {
  return <div>{JSON.stringify(firstPageData)}</div>;
};

export default BookPagination;
