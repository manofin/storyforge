"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Grid2X2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormEvent, useState } from "react";

const TABS = [
  { href: "/", label: "스토리", match: (p: string) => p === "/" || p.startsWith("/story") },
  { href: "/character", label: "캐릭터", match: (p: string) => p.startsWith("/character") },
  { href: "/works", label: "내 작품", match: (p: string) => p.startsWith("/works") },
  { href: "/image", label: "이미지", match: (p: string) => p.startsWith("/image") },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-desktop items-center gap-6 px-4">
        <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-brand">
          스토리포지
        </Link>

        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                  active ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                )}
              >
                {tab.label}
                {active && <span className="mt-1 block h-0.5 rounded-full bg-brand" />}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={onSearch} className="ml-auto flex min-w-0 flex-1 max-w-md items-center">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어를 입력해 주세요"
              className="w-full rounded-full border border-surface-border bg-surface-muted py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/10"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-surface-soft"
            aria-label="앱"
          >
            <Grid2X2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-surface-soft"
            aria-label="알림"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
            title="프로필"
          >
            SF
          </div>
        </div>
      </div>
    </header>
  );
}
