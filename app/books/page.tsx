import { getBooksWithPagination } from "@/app/books/actions";

export default async function Page() {
  // 첫 페이지에 필요한 데이터는 서버에서 미리 불러와서 클라이언트로 내려줌
  const firstPageData = await getBooksWithPagination({
    page: 0,
    size: 10,
  });

  // 그 이후로는 사용자의 조작에 따라 클라이언트와 서버를 왕복하며 데이터를 전달

  return <>{JSON.stringify(firstPageData)}</>;
}
