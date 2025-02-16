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

### 책 목록 페이지네이션(/app/books/BookPagination.tsx)

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

### 책 상세 정보 페이지
영상, 내용 작성예정

### 책 수량 조절기능
영상, 내용 작성예정
