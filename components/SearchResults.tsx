"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchCatalog, type SearchTab } from "@/lib/search";
import AvatarBadge from "./AvatarBadge";
import { CHARACTERS } from "@/data/fixtures";
import { cn, formatCount } from "@/lib/utils";

const TABS: { id: SearchTab; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "story", label: "스토리" },
  { id: "series", label: "시리즈" },
  { id: "character", label: "캐릭터" },
  { id: "account", label: "계정" },
  { id: "hashtag", label: "해시태그" },
];

export default function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const [tab, setTab] = useState<SearchTab>("all");
  const [sort, setSort] = useState<"relevant" | "popular">("relevant");

  const result = useMemo(() => searchCatalog(q, tab), [q, tab]);

  const charMap = useMemo(() => Object.fromEntries(CHARACTERS.map((c) => [c.id, c])), []);

  const storiesSorted = useMemo(() => {
    const list = [...result.stories];
    if (sort === "popular") list.sort((a, b) => b.messageCount - a.messageCount);
    return list;
  }, [result.stories, sort]);

  return (
    <div className="mx-auto max-w-desktop px-5 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-black text-gray-900">
          {q ? (
            <>
              <span className="text-brand">&ldquo;{q}&rdquo;</span> 검색 결과
            </>
          ) : (
            "검색"
          )}
        </h1>
        <p className="mt-1 text-sm text-gray-500">스토리, 캐릭터, 해시태그를 찾아보세요</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-surface-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold",
              tab === t.id ? "bg-brand text-white" : "text-gray-600 hover:bg-surface-soft"
            )}
          >
            {t.label}
            <span className="ml-1 text-[11px] opacity-70">
              {t.id === "all"
                ? result.counts.story + result.counts.character + result.counts.hashtag
                : result.counts[t.id]}
            </span>
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "relevant" | "popular")}
          className="ml-auto rounded-lg border border-surface-border bg-white px-2 py-1.5 text-xs font-semibold"
        >
          <option value="relevant">관련순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      {(tab === "all" || tab === "story" || tab === "series") && storiesSorted.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-gray-700">
            {tab === "series" ? "시리즈" : "스토리"}
          </h2>
          <div className="space-y-2">
            {storiesSorted
              .filter((s) => (tab === "series" ? s.isSeries : true))
              .map((s) => {
                const ch = charMap[s.characterId];
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => router.push(`/?story=${s.id}`)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-surface-border bg-white p-3 text-left shadow-soft hover:border-brand/30"
                  >
                    <AvatarBadge emoji={s.emoji} color={s.color} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">{s.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{s.summary}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.tags.map((t) => (
                          <span key={t} className="text-[11px] text-gray-400">
                            #{t}
                          </span>
                        ))}
                        {s.isSeries && s.seriesTitle && (
                          <span className="text-[11px] font-medium text-brand">{s.seriesTitle}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <div>{ch?.name.split("·")[0].trim()}</div>
                      <div>{s.messageCount}메시지</div>
                    </div>
                  </button>
                );
              })}
          </div>
        </section>
      )}

      {(tab === "all" || tab === "character") && result.characters.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-gray-700">캐릭터</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.characters.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => router.push("/character")}
                className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white p-3 text-left hover:border-brand/30"
              >
                <AvatarBadge emoji={c.emoji} color={c.color} size="md" />
                <div className="min-w-0">
                  <p className="font-bold">{c.name}</p>
                  <p className="truncate text-xs text-gray-500">{c.tagline}</p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    대화 {formatCount(c.chatCount)} · 좋아요 {formatCount(c.likes)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {(tab === "all" || tab === "account") && result.accounts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-gray-700">계정</h2>
          {result.accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                SF
              </div>
              <div>
                <p className="font-bold">{a.name}</p>
                <p className="text-xs text-gray-500">
                  {a.handle} · {a.bio}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {(tab === "all" || tab === "hashtag") && result.hashtags.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-700">해시태그</h2>
          <div className="flex flex-wrap gap-2">
            {result.hashtags.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => router.push(`/search?q=${encodeURIComponent(h.replace("#", ""))}`)}
                className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand/20 hover:bg-brand-50"
              >
                {h}
              </button>
            ))}
          </div>
        </section>
      )}

      {result.stories.length === 0 &&
        result.characters.length === 0 &&
        result.hashtags.length === 0 &&
        result.accounts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white py-16 text-center">
            <p className="text-sm font-semibold text-gray-700">검색 결과가 없습니다</p>
            <p className="mt-1 text-xs text-gray-400">다른 키워드로 다시 검색해 보세요</p>
          </div>
        )}
    </div>
  );
}
