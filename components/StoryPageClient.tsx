"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CHAT_SESSIONS, STORIES } from "@/data/fixtures";
import StorySidebar from "./StorySidebar";
import ChatPanel from "./ChatPanel";

export default function StoryPageClient() {
  const params = useSearchParams();
  const storyParam = params.get("story");

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

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-[1440px] overflow-hidden border-x border-surface-border bg-white">
      <StorySidebar
        activeChatId={activeChatId}
        showArchivePanel={showArchive}
        onToggleArchive={() => setShowArchive((v) => !v)}
        onSelectChat={(chatId, storyId) => {
          setActiveChatId(chatId);
          setActiveStoryId(storyId);
          setShowArchive(false);
        }}
      />
      <ChatPanel mode="story" storyId={activeStoryId} />
    </div>
  );
}
