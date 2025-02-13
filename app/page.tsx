import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-lvh flex justify-center items-center">
      <Link
        href={"/books"}
        className="p-2 bg-green-400 rounded-full font-extrabold"
      >
        책 관리하기
      </Link>
    </div>
  );
}
