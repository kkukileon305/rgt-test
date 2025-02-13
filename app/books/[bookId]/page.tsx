export default async function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const bookId = (await params).bookId;

  return <div>My Post: {bookId}</div>;
}
