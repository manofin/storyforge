"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CHARACTER_CHAT_SESSIONS,
  CHARACTERS,
  STORIES,
} from "@/data/fixtures";
import AvatarBadge from "./AvatarBadge";
import { formatCount } from "@/lib/utils";
import { Eye, Heart, MessageCircle, MessageSquare } from "lucide-react";

export default function CharacterDetail({ characterId }: { characterId: string }) {
  const router = useRouter();
  const character = CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0];
  const featured = STORIES.filter((s) => s.characterId === character.id);

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-[1440px] border-x border-surface-border bg-white">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-border md:flex">
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <p className="text-sm font-bold">채팅 내역</p>
          <button type="button" className="text-xs text-gray-400">
            편집
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {CHARACTER_CHAT_SESSIONS.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-border bg-surface-muted px-4 py-8 text-center text-xs text-gray-500">
              대화 목록이 비어있어요. 원하는 캐릭터를 플레이해 보세요.
            </div>
          ) : (
            CHARACTER_CHAT_SESSIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  c.characterId && router.push(`/character/${c.characterId}/chat`)
                }
                className="mb-0.5 flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-surface-muted"
              >
                <AvatarBadge emoji={c.emoji} color={c.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.title}</p>
                  <p className="truncate text-xs text-gray-500">{c.preview}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-soft">
            <div className="flex flex-col gap-5 p-5 sm:flex-row">
              <div
                className="relative flex h-56 w-full shrink-0 items-center justify-center rounded-xl text-6xl sm:h-64 sm:w-56"
                style={{
                  background: `linear-gradient(145deg, ${character.color}33, ${character.color}88)`,
                }}
              >
                <span aria-hidden>{character.emoji}</span>
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white">
                  <Heart className="h-3 w-3" />
                  {formatCount(character.likes)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black text-gray-900">{character.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>{character.creator ?? "@스토리포지"}</span>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px]">
                    이미지 {character.imageCount ?? 0}장
                  </span>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px]">
                    {character.category}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-3 rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-black"
                >
                  팔로우
                </button>
                {character.quote && (
                  <p className="mt-4 text-base font-bold leading-relaxed text-gray-900">
                    “{character.quote}”
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {character.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {character.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-gray-500"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {formatCount(character.chatCount)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {formatCount(character.likes)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {formatCount(character.commentCount ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-surface-border p-4">
              <Link
                href={`/character/${character.id}/chat`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-black"
              >
                <MessageSquare className="h-4 w-4" />
                대화하기
              </Link>
            </div>
          </div>

          {featured.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-bold text-gray-800">
                이 캐릭터가 등장하는 스토리
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {featured.map((s) => (
                  <Link
                    key={s.id}
                    href={`/?story=${s.id}`}
                    className="flex gap-3 rounded-xl border border-surface-border p-3 transition hover:bg-surface-muted"
                  >
                    <AvatarBadge emoji={s.emoji} color={s.color} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{s.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                        {s.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8 pb-10">
            <h2 className="mb-3 text-sm font-bold text-gray-800">댓글</h2>
            <div className="rounded-xl border border-surface-border bg-surface-muted px-4 py-6 text-center text-xs text-gray-500">
              커뮤니티 댓글 영역 (좋아요 · 답글 카운트 스텁)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
