import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const font = Noto_Sans_KR({
  subsets: ["latin"],
  weight: "300",
});

// 상점 주인을 위한 페이지이므로 SEO최적화 과정은 필요없을듯
export const metadata: Metadata = {
  title: "RGT - 과제",
  description: "RGT 웹 프론트엔드 과제",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`${font.className}`}>
        <div className="max-w-md w-full min-h-lvh mx-auto bg-amber-100">
          {children}
        </div>
      </body>
    </html>
  );
}
