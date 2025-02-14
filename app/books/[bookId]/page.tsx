import { getBookDetail } from "@/app/books/actions";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const bookId = Number((await params).bookId);

  const bookDetail = await getBookDetail(bookId);

  // 없는 책 요청시 redirect to books
  if (!bookDetail) {
    redirect("/books");
  }

  return <div>{JSON.stringify(bookDetail)}</div>;
}
