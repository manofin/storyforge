"use client";

import { ARCHIVES, CHAT_SESSIONS } from "@/data/fixtures";
import AvatarBadge from "./AvatarBadge";
import { MoreVertical, MessageSquarePlus, Archive, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  activeChatId: string;
  onSelectChat: (chatId: string, storyId: string) => void;
  showArchivePanel?: boolean;
  onToggleArchive?: () => void;
};

export default function StorySidebar({
  activeChatId,
  onSelectChat,
  showArchivePanel = false,
  onToggleArchive,
}: Props) {
  if (showArchivePanel) {
    return (
      <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-surface-border bg-white">
        <div className="flex items-center gap-2 border-b border-surface-border px-3 py-3">
          <button
            type="button"
            onClick={onToggleArchive}
            className="rounded-lg p-1.5 hover:bg-surface-soft"
            aria-label="뒤로"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-bold">보관함</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {ARCHIVES.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-surface-muted"
            >
              <AvatarBadge emoji={a.emoji} color={a.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-gray-500">{a.count}개</p>
              </div>
              <button type="button" className="rounded p-1 text-gray-400 hover:bg-surface-soft">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="relative flex h-full w-[280px] shrink-0 flex-col border-r border-surface-border bg-white">
      <div className="flex border-b border-surface-border px-3">
        <button className="relative px-3 py-3 text-sm font-bold text-gray-900">
          에피소드
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gray-900" />
        </button>
        <button className="px-3 py-3 text-sm font-medium text-gray-400 hover:text-gray-600">
          파티챗
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-4">
          <button
            type="button"
            onClick={onToggleArchive}
            className="mb-2 flex w-full items-center gap-2 rounded-lg px-1 text-xs font-bold text-gray-500 hover:text-gray-800"
          >
            <Archive className="h-3.5 w-3.5" />
            보관함
          </button>
          {ARCHIVES.map((a) => (
            <div
              key={a.id}
              className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-muted"
            >
              <AvatarBadge emoji={a.emoji} color={a.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-gray-500">{a.count}개</p>
              </div>
              <button
                type="button"
                className="rounded p-1 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-surface-soft hover:text-gray-500"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="px-3 pb-16 pt-2">
          <p className="mb-2 px-1 text-xs font-bold text-gray-500">채팅 목록</p>
          {CHAT_SESSIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => c.storyId && onSelectChat(c.id, c.storyId)}
              className={cn(
                "mb-0.5 flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition",
                activeChatId === c.id ? "bg-brand-50" : "hover:bg-surface-muted"
              )}
            >
              <AvatarBadge emoji={c.emoji} color={c.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.title}</p>
                <p className="truncate text-xs text-gray-500">{c.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-card hover:bg-brand-600"
        aria-label="새 채팅"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>
    </aside>
  );
}
