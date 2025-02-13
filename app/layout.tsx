import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const font = Noto_Sans_KR({
  subsets: ["latin"],
  weight: "300",
});

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
      <body className={`${font.className} min-h-lvh`}>
        <div className="max-w-md w-full mx-auto bg-amber-100">{children}</div>
      </body>
    </html>
  );
}
