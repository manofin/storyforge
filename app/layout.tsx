import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { MobileShellProvider } from "@/components/MobileShell";

export const metadata: Metadata = {
  title: "스토리포지 · StoryForge",
  description: "이야기와 캐릭터를 만들고 대화하는 스토리포지",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-surface-muted antialiased">
        <MobileShellProvider>
          <TopNav />
          <main>{children}</main>
        </MobileShellProvider>
      </body>
    </html>
  );
}
