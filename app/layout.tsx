import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { RecipeProvider } from "@/store/RecipeContext";

const headingFont = Zen_Maru_Gothic({
  variable: "--font-heading-jp",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const bodyFont = Noto_Sans_JP({
  variable: "--font-body-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "料理レシピ",
  description: "自分だけの料理レシピを登録・管理するアプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${headingFont.variable} ${bodyFont.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <RecipeProvider>{children}</RecipeProvider>
      </body>
    </html>
  );
}
