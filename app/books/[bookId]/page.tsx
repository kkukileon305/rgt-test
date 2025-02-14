import { getBookDetail } from "@/app/books/actions";
import { redirect } from "next/navigation";
import { FaArrowCircleLeft } from "react-icons/fa";
import Link from "next/link";

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

  return (
    <div className="h-lvh">
      {/* 상단 타이틀바 */}
      <div className="relative h-12 flex justify-center items-center bg-white shadow">
        <Link href={"/books"} className="absolute left-2">
          <FaArrowCircleLeft size={32} />
        </Link>
        <p className="font-extrabold">{bookDetail.title}</p>
      </div>

      {/* 내용 */}
      <div className="h-[calc(100%-96px)] overflow-y-auto">
        <div className="p-4">
          <p className="border border-black bg-white w-fit px-1">
            {bookDetail.genre}
          </p>
        </div>
        <h2 className="px-4 py-2 font-extrabold text-2xl">
          {bookDetail.title}
        </h2>
        <p className="px-4 py-2">{bookDetail.author}</p>
        <p className="px-4 py-2">{bookDetail.description}</p>
      </div>

      {/* 하단 수량 네비게이션 */}
      <div className="h-12 bg-white shadow">nav</div>
    </div>
  );
}
