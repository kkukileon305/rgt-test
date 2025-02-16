## 배포
https://rgt-test-phi.vercel.app/

## 설치와 실행

1. Nodejs 18.18(https://nodejs.org/ko) 이상의 버전을 설치해야합니다.
2. 해당 프로젝트를 클론합니다.
```aiignore
git clone https://github.com/kkukileon305/rgt-test
```
3. 프로젝트 디렉토리로 이동합니다.
```aiignore
cd rgt-test
```

4. 필요한 패키지를 install 합니다.
```aiignore
npm i
```
5. 개발 서버를 실행합니다.
```aiignore
npm run dev
```
6. http://localhost:3000로 접속합니다

## 구현 설명

### FAKE api
Nextjs의 server action을 이용하여 api연결 과정을 최소화하였습니다.

### 책 목록 페이지네이션(/app/books/BookPagination.tsx)


https://github.com/user-attachments/assets/f806a13b-e16f-4358-9029-e6cc32303909



페이지네이션 관리에 필요한 상태들을 useState로 저장합니다.
```typescript
// bookData: 현재 페이지의 책 데이터를 저장합니다.
const [bookData, setBookData] = useState<BookPaginationData | null>(null);
// page: 현재 선택된 페이지 번호를 저장합니다.
const [page, setPage] = useState(0);
// title, author: 검색 필터(책 제목과 저자)를 저장합니다.
const [title, setTitle] = useState("");
const [author, setAuthor] = useState("");
// isLoading: 데이터를 가져오는 동안 로딩 상태를 관리합니다.
const [isLoading, setIsLoading] = useState(false);
```

페이지네이션 네비게이터에 필요한 변수들을 선언합니다.
```typescript
// 네이게이터 페이지
const totalPages = Math.ceil((bookData ? bookData.count : 0) / 10);
const pages = Array.from({ length: totalPages }, (_, i) => i);
```

책 제목과 저자 필터링에 이용될 onSubmit 함수를 만들어줍니다.
<br />
일관성을 위해 제목이나 저자를 변경시 page도 0으로 초기화하도록 하였습니다.
<br />
onSubmit은 아래에서 필터링 form에서 사용됩니다.

```typescript
const onSubmit: FormEventHandler = async (e) => {
  e.preventDefault();

  const target = e.target as HTMLFormElement;

  // 일관성을 위해 제목이나 저자를 변경시 page 초기화
  setPage(0);

  setAuthor(target.author.value);
  setTitle(target.bookTitle.value);
};
```

page, title, author가 변경되어 리렌더링 될때마다 useEffect를 실행해줍니다.
<br/>
초기값 또는 변경된 값들을 이용해 조건에 책 데이터들을 서버로부터 불러와준 뒤 설정해줍니다.


```typescript
useEffect(() => {
  (async () => {
    setIsLoading(true);
    const newData = await getBooksWithPagination({
      page,
      size: 10,
    });

    setIsLoading(false);
    setBookData(newData);
  })();
}, [page, title, author]);
```

설정된 bookData값을 이용해 책 데이터들을 ui에 맞게 렌더링해줍니다.
<br />
동시에 isLoading 상태도 구분하여 렌더링합니다.
```tsx
{!isLoading && (
  <ul className="h-full">
    {bookData?.data.map((book) => (
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
```

북 리스트 위에 제목과 저자 필터링을 위한 form도 렌더링해줍니다.
<br />
제목과 저자 값 상태는 onChange로 관리합니다.
<br />
버튼은 submit타입으로 설정하여 명확하게 form submit용으로 설정합니다.
```tsx
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
```

하단영역에 totalPages와 pages 값을 이용해 네비게이터를 만들어줍니다.
<br />
pages안의 p 값이 현재 page와 같을 경우 disable=true로 설정하여 불필요한 같은 페이지 요청을 막습니다.
<br />
page를 올리고 내리는 버튼도 추가해줍니다. 현재 페이지가 0이거나 마지막일 경우에 disabled로 설정해줍니다.
<br />
버튼을 클릭할 시 바로 페이지와 loading 상태를 동시에 변경해줍니다.
<br />

```tsx
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
```
책 항목를 클릭시 books/{bookId}로 이동하게 됩니다.

### 책 상세 정보 페이지(/app/books/[bookId]/page.tsx)



https://github.com/user-attachments/assets/4dc78a8e-3175-47dd-9521-1f581991e929



사용자가 상세 정보 페이지에 접속시 page 서버 컴포넌트에서 bookId 값을 이용해 detail 정보를 불러옵니다.
<br />
혹시나 사용자가 없는 bookId에 접속할 경우를 대비하여 detail정보가 없을시 /books로 redirect하도록 구현했습니다.
<br />
하단에 수량 조정 컨트롤러 컴포넌트를 만들어줍니다.

```tsx

export default async function Page({ params}: {
    params: Promise<{ bookId: string }>;
}) {
    const bookId = Number((await params).bookId);

    const bookDetail = await getBookDetail(bookId);

    // 없는 책 요청시 redirect to books
    if (!bookDetail) {
        redirect("/books");
    }

    return <>
    ...

        {/* 하단 관리 네비게이션 */}
        <div className="h-12 bg-white shadow">
            <BookController bookDetail={bookDetail} />
        </div>
    </>
}
```

### 책 수량 조절기능(/app/books/[bookId]/BookController.tsx)



https://github.com/user-attachments/assets/2f337e19-d2ce-4ed5-bebb-b419cabadfec



관리 버튼을 클릭시 모달컴포넌트를 나타나게 하여 관리하도록 하였습니다.
<br />
책 디테일 정보는 page.tsx 로부터 받습니다.

```
const BookController = ({ bookDetail }: { bookDetail: FakeBookDetail }) => {
  // 나중에 데이터들을 다시 불러오는데 사용됩니다
  const router = useRouter();
  // 모달 상태를 저장합니다
  const [isOpen, setIsOpen] = useState(false);
  // 새 count를 저장합니다
  const [newCount, setNewCount] = useState(bookDetail.count);
  // loading상태입니다
  const [isLoading, setIsLoading] = useState(false);
  
  ...
```

수량 변경 form에 쓸 onSubmit 입니다.
<br />
성공했을 경우 router.refresh를 이용해 수정된 데이터로 다시 불러와줍니다.

```typescript
const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const isSuccess = await updateBook({
        id: bookDetail.id,
        count: newCount,
    });

    setIsLoading(false);
    setIsOpen(false);

    if (isSuccess) {
        router.refresh();
    }
};
```


관리 버튼을 클릭하면 isOpen 상태가 true가 되어 모달창이 보여지게 됩니다.
<br />
수량 변경의 경우 input:number의 onChange를 이용하여 관리합니다.
<br />
form의 submit을 이용하여 설정해주도록 구현했습니다. 수량이 아직 불변이거나 loading일때는 disabled로 하였습니다.
```tsx
<>
    {isOpen && (
        <div className="left-0 top-0 absolute w-full h-full bg-black/40 flex justify-center items-center p-4">
            <div className="w-full bg-white rounded shadow overflow-hidden">
                <form onSubmit={onSubmit} className="flex p-4">
                    <p className="font-extrabold text-xl w-[calc(100%-72px)]">
                        수량 변경
                    </p>
                    <input
                        type="number"
                        className="border w-10 text-center"
                        defaultValue={newCount}
                        onChange={(e) => {
                            setNewCount(Number(e.target.value));
                        }}
                        id="newCount"
                    />
                    <button
                        type="submit"
                        className="w-8 flex justify-center items-center disabled:grayscale"
                        disabled={newCount === bookDetail.count || isLoading}
                    >
                        <FaSave size={20} color="green" />
                    </button>
                </form>

                <p className="text-sm text-center mb-4">
                    숫자를 입력 후 오른쪽의 저장 버튼을 <br /> 클릭해여 저장해주세요!
                </p>

                <div className="flex">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white bg-blue-400 p-2 w-full font-extrabold"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )}
    <button
        className="w-full h-full flex justify-center items-center gap-2"
        onClick={() => setIsOpen(true)}
    >
        관리 <FaArrowUp size={24} />
    </button>
</>
```
