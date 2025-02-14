"use client";

import { FakeBookDetail, updateBook } from "@/app/books/actions";
import { FaArrowUp, FaSave } from "react-icons/fa";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

const BookController = ({ bookDetail }: { bookDetail: FakeBookDetail }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newCount, setNewCount] = useState(bookDetail.count);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await updateBook({
      id: bookDetail.id,
      count: newCount,
    });
    setIsLoading(false);

    setIsOpen(false);
    router.refresh();
  };

  return (
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
              <button className="text-white bg-red-400 p-2 w-1/2 font-extrabold">
                상품 삭제
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white bg-blue-400 p-2 w-1/2 font-extrabold"
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
  );
};

export default BookController;
