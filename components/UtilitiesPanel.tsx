"use client";

import type { ReactNode } from "react";
import { BookOpen, Brain, ImageIcon, MessageCircleMore, StickyNote, UserRound, X } from "lucide-react";
import type { UtilitySettings } from "@/data/types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: UtilitySettings;
  onChange: (next: UtilitySettings) => void;
  mode: "story" | "character";
  /** Mobile: fixed right drawer. Desktop: persistent aside. */
  variant?: "aside" | "drawer";
};

function ToggleRow({
  label,
  description,
  active,
  onToggle,
  icon,
}: {
  label: string;
  description?: string;
  active: boolean;
  onToggle: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
        active
          ? "border-send/40 bg-teal-50/80"
          : "border-surface-border bg-white hover:bg-surface-muted"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          active ? "bg-send text-white" : "bg-surface-soft text-gray-500"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-900">{label}</span>
        {description && <span className="block text-[11px] text-gray-500">{description}</span>}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          active ? "bg-send" : "bg-gray-300"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
            active ? "left-4" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

export default function UtilitiesPanel({
  open,
  onClose,
  settings,
  onChange,
  mode,
  variant = "aside",
}: Props) {
  if (!open && variant === "aside") return null;

  const patch = (partial: Partial<UtilitySettings>) => onChange({ ...settings, ...partial });

  const panel = (
    <>
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-bold text-gray-900">대화 도구</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-surface-soft hover:text-gray-600"
          aria-label="패널 닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <button
          type="button"
          onClick={() => patch({ playGuide: !settings.playGuide })}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left",
            settings.playGuide ? "border-send/40 bg-teal-50/80" : "border-surface-border"
          )}
        >
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="flex-1 text-sm font-semibold">플레이 가이드</span>
          <span className="text-[11px] text-gray-400">{settings.playGuide ? "열림" : "스텁"}</span>
        </button>
        {settings.playGuide && (
          <div className="rounded-xl bg-surface-muted px-3 py-2 text-xs leading-relaxed text-gray-600">
            자유 입력 또는 추천 선택으로 장면을 이끌어 보세요. 연필 아이콘은 선택지를 편집창으로 옮깁니다.
          </div>
        )}

        <button
          type="button"
          onClick={() => patch({ conversationProfile: !settings.conversationProfile })}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left",
            settings.conversationProfile ? "border-send/40 bg-teal-50/80" : "border-surface-border"
          )}
        >
          <UserRound className="h-4 w-4 text-gray-500" />
          <span className="flex-1 text-sm font-semibold">대화 프로필</span>
          <span className="text-[11px] text-gray-400">{settings.conversationProfile ? "열림" : "스텁"}</span>
        </button>
        {settings.conversationProfile && (
          <div className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-gray-600">
            {mode === "story"
              ? "스토리 톤·세계관 요약이 여기에 표시됩니다. (스텁)"
              : "캐릭터 성격·말투 요약이 여기에 표시됩니다. (스텁)"}
          </div>
        )}

        <button
          type="button"
          onClick={() => patch({ summaryMemory: !settings.summaryMemory })}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left",
            settings.summaryMemory ? "border-send/40 bg-teal-50/80" : "border-surface-border"
          )}
        >
          <Brain className="h-4 w-4 text-gray-500" />
          <span className="flex-1 text-sm font-semibold">요약 메모리</span>
          <span className="text-[11px] text-gray-400">{settings.summaryMemory ? "열림" : "스텁"}</span>
        </button>
        {settings.summaryMemory && (
          <div className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-gray-600">
            최근 장면과 주요 선택이 요약되어 이어집니다. (스텁)
          </div>
        )}

        <ToggleRow
          label="상황 이미지 보기"
          description="응답 후 장면 이미지 자리 표시"
          active={settings.situationImage}
          onToggle={() => patch({ situationImage: !settings.situationImage })}
          icon={<ImageIcon className="h-4 w-4" />}
        />

        {mode === "character" && (
          <ToggleRow
            label="캐릭터 메시지 받기"
            description="캐릭터가 먼저 말을 거는 옵션"
            active={settings.characterInitiated}
            onToggle={() => patch({ characterInitiated: !settings.characterInitiated })}
            icon={<MessageCircleMore className="h-4 w-4" />}
          />
        )}

        <div className="rounded-xl border border-surface-border px-3 py-3">
          <p className="mb-2 text-sm font-semibold text-gray-900">출력 길이</p>
          <div className="flex gap-1.5">
            {(
              [
                ["short", "짧게"],
                ["medium", "보통"],
                ["long", "길게"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => patch({ outputLength: id })}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-semibold transition",
                  settings.outputLength === id
                    ? "bg-gray-900 text-white"
                    : "bg-surface-muted text-gray-600 hover:bg-surface-soft"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border px-3 py-3">
          <div className="mb-2 flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-semibold text-gray-900">유저 노트</p>
          </div>
          <textarea
            value={settings.userNote}
            onChange={(e) => patch({ userNote: e.target.value })}
            rows={3}
            placeholder="이 대화에만 적용할 메모…"
            className="w-full resize-none rounded-lg border border-surface-border bg-surface-muted px-2.5 py-2 text-xs outline-none focus:border-brand/30 focus:bg-white"
          />
        </div>
      </div>

      <div className="border-t border-surface-border px-4 py-2 text-[11px] text-gray-400">
        {mode === "story" ? "스토리 V40" : "캐릭터 V3"} · 스토리포지
      </div>
    </>
  );

  if (variant === "drawer") {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          role="dialog"
          aria-modal="true"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(320px,75vw)] max-w-full flex-col bg-white shadow-card transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          {panel}
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col border-l border-surface-border bg-white md:flex">
      {panel}
    </aside>
  );
}
