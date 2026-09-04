"use client";

import { useMemo, useState } from "react";
import { WORKS } from "@/data/fixtures";
import AvatarBadge from "./AvatarBadge";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const FILTERS = [
  { id: "all", label: "전체" },
  { id: "story", label: "스토리" },
  { id: "character", label: "캐릭터" },
  { id: "public", label: "공개" },
  { id: "private", label: "비공개" },
  { id: "unregistered", label: "미등록" },
] as const;

export default function WorksPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [showEmpty, setShowEmpty] = useState(false);

  const list = useMemo(() => {
    if (showEmpty) return [];
    return WORKS.filter((w) => {
      if (filter === "all") return true;
      if (filter === "story" || filter === "character") return w.type === filter;
      if (filter === "public" || filter === "private") return w.visibility === filter;
      if (filter === "unregistered") return w.status === "unregistered";
      return true;
    });
  }, [filter, showEmpty]);

  return (
    <div className="mx-auto max-w-desktop px-5 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">내 작품</h1>
          <p className="mt-1 text-sm text-gray-500">스토리와 캐릭터를 만들고 관리하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmpty((v) => !v)}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 ring-1 ring-surface-border hover:bg-surface-soft"
          >
            {showEmpty ? "샘플 보기" : "빈 상태 보기"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            작품 만들기
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
              filter === f.id
                ? "bg-brand text-white"
                : "bg-white text-gray-600 ring-1 ring-surface-border hover:bg-surface-soft"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-surface-border bg-white px-6 py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-4xl">
            ✨
          </div>
          <h2 className="text-lg font-bold text-gray-900">아직 작품이 없어요</h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            첫 스토리나 캐릭터를 만들어 나만의 세계를 열어보세요.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            작품 만들기
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {list.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-4 rounded-2xl border border-surface-border bg-white p-4 shadow-soft"
            >
              <AvatarBadge emoji={w.emoji} color={w.color} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-bold text-gray-900">{w.title}</h3>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    {w.type === "story" ? "스토리" : "캐릭터"}
                  </span>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    {w.visibility === "public"
                      ? "공개"
                      : w.visibility === "private"
                        ? "비공개"
                        : "미등록"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">업데이트 {w.updatedAt}</p>
              </div>
              <button
                type="button"
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-surface-border hover:bg-surface-soft"
              >
                편집
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
