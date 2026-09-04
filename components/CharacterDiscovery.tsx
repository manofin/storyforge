"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CHARACTER_CATEGORIES, CHARACTERS, STORIES } from "@/data/fixtures";
import AvatarBadge from "./AvatarBadge";
import { formatCount } from "@/lib/utils";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CharacterDiscovery() {
  const [category, setCategory] = useState<string>("추천");
  const router = useRouter();

  const list = useMemo(() => {
    if (category === "추천" || category === "신작" || category === "랭킹") {
      const sorted = [...CHARACTERS];
      if (category === "랭킹") sorted.sort((a, b) => b.likes - a.likes);
      if (category === "신작") sorted.reverse();
      return sorted;
    }
    return CHARACTERS.filter((c) => c.category === category || c.tags.includes(category));
  }, [category]);

  const startChat = (characterId: string) => {
    const story = STORIES.find((s) => s.characterId === characterId);
    if (story) router.push(`/?story=${story.id}`);
    else router.push("/");
  };

  return (
    <div className="mx-auto flex h-full max-w-desktop gap-0">
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-white p-4 md:block">
        <p className="mb-3 text-sm font-bold text-gray-800">대화 목록</p>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface-muted px-4 py-10 text-center">
          <div className="mb-3 text-3xl">💬</div>
          <p className="text-sm font-semibold text-gray-700">아직 대화가 없어요</p>
          <p className="mt-1 text-xs text-gray-500">캐릭터를 골라 스토리를 시작해 보세요</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto p-5">
        <div className="mb-5 flex flex-wrap gap-2">
          {CHARACTER_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                category === c
                  ? "bg-brand text-white"
                  : "bg-white text-gray-600 ring-1 ring-surface-border hover:bg-surface-soft"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => startChat(c.id)}
              className="group flex flex-col rounded-2xl border border-surface-border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="mb-3 flex items-start gap-3">
                <AvatarBadge emoji={c.emoji} color={c.color} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-gray-900 group-hover:text-brand">
                    {c.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{c.tagline}</p>
                </div>
              </div>
              <p className="mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                {c.description}
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-gray-500"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {formatCount(c.chatCount)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {formatCount(c.likes)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
