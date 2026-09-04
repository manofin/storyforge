"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { CHAT_SESSIONS, STORIES } from "@/data/fixtures";
import { cn } from "@/lib/utils";
import StorySidebar from "./StorySidebar";
import ChatPanel from "./ChatPanel";
import MobileDrawer from "./MobileDrawer";
import { useMobileShell } from "./MobileShell";
import { NAV_TABS } from "./navTabs";

export default function StoryPageClient() {
  const params = useSearchParams();
  const pathname = usePathname();
  const storyParam = params.get("story");
  const { leftOpen, closeLeft } = useMobileShell();

  const initial = useMemo(() => {
    const story =
      STORIES.find((s) => s.id === storyParam) ??
      STORIES.find((s) => s.id === CHAT_SESSIONS[0].storyId) ??
      STORIES[0];
    const chat =
      CHAT_SESSIONS.find((c) => c.storyId === story.id) ?? CHAT_SESSIONS[0];
    return { storyId: story.id, chatId: chat.id };
  }, [storyParam]);

  const [activeChatId, setActiveChatId] = useState(initial.chatId);
  const [activeStoryId, setActiveStoryId] = useState(initial.storyId);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    setActiveStoryId(initial.storyId);
    setActiveChatId(initial.chatId);
  }, [initial.chatId, initial.storyId]);

  const selectChat = (chatId: string, storyId: string) => {
    setActiveChatId(chatId);
    setActiveStoryId(storyId);
    setShowArchive(false);
    closeLeft();
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-[1440px] overflow-hidden border-x border-surface-border bg-white">
      {/* Desktop persistent sidebar */}
      <div className="hidden h-full md:flex">
        <StorySidebar
          activeChatId={activeChatId}
          showArchivePanel={showArchive}
          onToggleArchive={() => setShowArchive((v) => !v)}
          onSelectChat={selectChat}
        />
      </div>

      {/* Mobile left drawer: nav + archive/chat list */}
      <MobileDrawer
        open={leftOpen}
        onClose={closeLeft}
        side="left"
        labelledBy="story-mobile-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <p id="story-mobile-drawer-title" className="text-sm font-bold text-gray-900">
            스토리포지
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

        <nav className="border-b border-surface-border px-2 py-2">
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

        <div className="min-h-0 flex-1 overflow-hidden">
          <StorySidebar
            fill
            className="border-r-0"
            activeChatId={activeChatId}
            showArchivePanel={showArchive}
            onToggleArchive={() => setShowArchive((v) => !v)}
            onSelectChat={selectChat}
          />
        </div>
      </MobileDrawer>

      <ChatPanel mode="story" storyId={activeStoryId} />
    </div>
  );
}
