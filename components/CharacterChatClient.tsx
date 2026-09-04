"use client";

import { useRouter } from "next/navigation";
import {
  CHARACTER_CHAT_SESSIONS,
  CHARACTERS,
} from "@/data/fixtures";
import AvatarBadge from "./AvatarBadge";
import ChatPanel from "./ChatPanel";
import { cn } from "@/lib/utils";

export default function CharacterChatClient({ characterId }: { characterId: string }) {
  const router = useRouter();
  const character = CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0];

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-[1440px] overflow-hidden border-x border-surface-border bg-white">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-border md:flex">
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <p className="text-sm font-bold">채팅 내역</p>
          <button type="button" className="text-xs text-gray-400">
            편집
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {CHARACTER_CHAT_SESSIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                c.characterId && router.push(`/character/${c.characterId}/chat`)
              }
              className={cn(
                "mb-0.5 flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition",
                c.characterId === character.id ? "bg-brand-50" : "hover:bg-surface-muted"
              )}
            >
              <AvatarBadge emoji={c.emoji} color={c.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.title}</p>
                <p className="truncate text-xs text-gray-500">{c.preview}</p>
              </div>
            </button>
          ))}
          {!CHARACTER_CHAT_SESSIONS.some((c) => c.characterId === character.id) && (
            <div className="mt-1 flex items-center gap-3 rounded-xl bg-brand-50 px-2 py-2.5">
              <AvatarBadge emoji={character.emoji} color={character.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{character.name}</p>
                <p className="truncate text-xs text-gray-500">새 대화</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <ChatPanel
        mode="character"
        characterId={character.id}
        title={character.name}
      />
    </div>
  );
}
