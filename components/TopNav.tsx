"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormEvent, useEffect, useState } from "react";
import { NAV_TABS } from "./navTabs";
import { useMobileShell } from "./MobileShell";
import MobileDrawer from "./MobileDrawer";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { leftOpen, toggleLeft, closeLeft, rightOpen } = useMobileShell();

  // Story home owns a richer left drawer (nav + archive); elsewhere TopNav shows nav-only.
  const storyOwnsLeftDrawer = pathname === "/" || pathname.startsWith("/story");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    setSearchOpen(false);
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  useEffect(() => {
    closeLeft();
  }, [pathname, closeLeft]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur">
        {/* Mobile header */}
        <div className="relative mx-auto flex h-14 max-w-desktop items-center px-2 md:hidden">
          <button
            type="button"
            onClick={toggleLeft}
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-surface-soft"
            aria-label="메뉴 열기"
            aria-expanded={leftOpen}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl font-black tracking-tight text-brand"
          >
            스토리포지
          </Link>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-surface-soft"
              aria-label="검색"
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:bg-surface-soft xs:flex sm:flex"
              aria-label="알림"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
              title="프로필"
            >
              SF
            </div>
          </div>
        </div>

        {searchOpen && (
          <form
            onSubmit={onSearch}
            className="border-t border-surface-border px-3 py-2 md:hidden"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="검색어를 입력해 주세요"
                className="w-full rounded-full border border-surface-border bg-surface-muted py-2.5 pl-9 pr-10 text-sm outline-none focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/10"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:bg-surface-soft"
                aria-label="검색 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Desktop header */}
        <div className="mx-auto hidden h-14 max-w-desktop items-center gap-6 px-4 md:flex">
          <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-brand">
            스토리포지
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_TABS.map((tab) => {
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

      {/* Nav-only left drawer for non-story pages (story page renders its own richer drawer) */}
      {!storyOwnsLeftDrawer && (
        <MobileDrawer open={leftOpen && !rightOpen} onClose={closeLeft} side="left" labelledBy="mobile-nav-title">
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
            <p id="mobile-nav-title" className="text-sm font-bold text-gray-900">
              메뉴
            </p>
            <button
              type="button"
              onClick={closeLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-surface-soft"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {NAV_TABS.map((tab) => {
              const active = tab.match(pathname);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={closeLeft}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-3 text-base font-semibold transition",
                    active ? "bg-brand-50 text-brand" : "text-gray-800 hover:bg-surface-muted"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </MobileDrawer>
      )}
    </>
  );
}
