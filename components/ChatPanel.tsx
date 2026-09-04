"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type MouseEvent } from "react";
import {
  ChevronRight,
  GitBranch,
  ImageIcon,
  MoreHorizontal,
  PanelRight,
  Pencil,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import {
  CHARACTER_MODELS,
  CHARACTERS,
  DEFAULT_UTILITY_SETTINGS,
  INITIAL_CHARACTER_MESSAGES,
  INITIAL_MESSAGES,
  STORIES,
  STORY_MODELS,
  SUGGESTED_REPLIES,
} from "@/data/fixtures";
import type {
  ChatMessage,
  ConversationMode,
  SceneState,
  UtilitySettings,
} from "@/data/types";
import {
  cn,
  pickMockChoices,
  pickMockReply,
  pickMockState,
  streamText,
} from "@/lib/utils";
import ModelPicker from "./ModelPicker";
import RecommendationChoices from "./RecommendationChoices";
import UtilitiesPanel from "./UtilitiesPanel";
import AvatarBadge from "./AvatarBadge";

type Props = {
  mode?: ConversationMode;
  storyId?: string;
  characterId?: string;
  title?: string;
};

type MenuState = { messageId: string; x: number; y: number } | null;

export default function ChatPanel({
  mode = "story",
  storyId,
  characterId,
  title,
}: Props) {
  const story = STORIES.find((s) => s.id === storyId);
  const character =
    CHARACTERS.find((c) => c.id === characterId) ??
    CHARACTERS.find((c) => c.id === story?.characterId);

  const seed = mode === "character" ? characterId ?? "default" : storyId ?? "default";
  const models = mode === "character" ? CHARACTER_MODELS : STORY_MODELS;

  const initialMessages = useMemo(() => {
    if (mode === "character") {
      return INITIAL_CHARACTER_MESSAGES[characterId ?? ""] ?? [];
    }
    return INITIAL_MESSAGES[storyId ?? ""] ?? [];
  }, [mode, storyId, characterId]);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [modelId, setModelId] = useState(models[0]?.id ?? "forge-2");
  const [showTip, setShowTip] = useState(mode === "story");
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>(() => {
    if (mode === "story") {
      return SUGGESTED_REPLIES[storyId ?? ""] ?? pickMockChoices(seed, 0, mode);
    }
    return [];
  });
  const [showChoices, setShowChoices] = useState(mode === "story");
  const [genRecLoading, setGenRecLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [settings, setSettings] = useState<UtilitySettings>({ ...DEFAULT_UTILITY_SETTINGS });
  const [menu, setMenu] = useState<MenuState>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const headerTitle =
    title ??
    (mode === "character" ? character?.name ?? "캐릭터" : story?.title ?? "스토리");

  const selectedModel = models.find((m) => m.id === modelId) ?? models[0];

  useEffect(() => {
    setMessages(initialMessages);
    setInput("");
    turnRef.current = 0;
    setSending(false);
    setStatusText(null);
    setEditingId(null);
    abortRef.current?.abort();
    if (mode === "story") {
      setChoices(SUGGESTED_REPLIES[storyId ?? ""] ?? pickMockChoices(seed, 0, mode));
      setShowChoices(true);
    } else {
      setChoices([]);
      setShowChoices(false);
    }
  }, [initialMessages, mode, storyId, seed]);

  useEffect(() => {
    if (!models.some((m) => m.id === modelId) && models[0]) {
      setModelId(models[0].id);
    }
  }, [models, modelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, statusText, choices, showChoices]);

  useEffect(() => {
    const close = () => setMenu(null);
    if (menu) {
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [menu]);

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
    setStatusText(null);
    setMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false } : m))
    );
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSending(true);
    setInput("");
    setShowChoices(false);
    setEditingId(null);
    setMenu(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    turnRef.current += 1;
    const turn = turnRef.current;

    setStatusText(
      mode === "story" ? "세계관에 반영 중…" : "캐릭터가 답하는 중…"
    );

    let reply = pickMockReply(seed, turn);
    let nextChoices = pickMockChoices(seed, turn, mode);
    let nextState: SceneState | undefined =
      mode === "story" ? pickMockState(seed, turn) : undefined;

    try {
      await new Promise((r) => setTimeout(r, 450));
      if (controller.signal.aborted) return;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: storyId ?? seed,
          characterId,
          mode,
          turn,
          message: trimmed,
          modelId,
          outputLength: settings.outputLength,
          userNote: settings.userNote,
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.reply === "string" && data.reply.trim()) reply = data.reply;
        if (Array.isArray(data.choices) && data.choices.length === 3) {
          nextChoices = data.choices;
        }
        if (data.state && typeof data.state === "object") nextState = data.state;
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
    }

    if (controller.signal.aborted) return;
    setStatusText(null);

    const aiId = `a-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiId,
      role: "assistant",
      kind: mode === "character" ? "dialogue" : "narrative",
      content: "",
      streaming: true,
      showSceneImage: mode === "story" && settings.situationImage,
      state: mode === "story" ? nextState : undefined,
    };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      await streamText(
        reply,
        (partial) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === aiId ? { ...m, content: partial } : m))
          );
        },
        { signal: controller.signal, chunkSize: 14, delayMs: 22 }
      );
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m))
        );
        setSending(false);
        setStatusText(null);
        return;
      }
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m))
    );
    setChoices(nextChoices);
    setShowChoices(true);
    setSending(false);
    abortRef.current = null;
  };

  const generateRecommendations = async () => {
    if (sending || genRecLoading) return;
    setGenRecLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const next = pickMockChoices(seed, turnRef.current + 100 + Date.now() % 7, mode);
    setChoices(next);
    setShowChoices(true);
    setGenRecLoading(false);
  };

  const regenerateMessage = async (messageId: string) => {
    if (sending) return;
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx < 0 || messages[idx].role !== "assistant") return;
    // find preceding user message
    let userText = "";
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userText = messages[i].content;
        break;
      }
    }
    setMessages((prev) => prev.slice(0, idx));
    turnRef.current = Math.max(0, turnRef.current - 1);
    await send(userText || "장면을 다시 이어간다");
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    setMenu(null);
  };

  const startEdit = (message: ChatMessage) => {
    setEditingId(message.id);
    setInput(message.content);
    setMenu(null);
    textareaRef.current?.focus();
  };

  const applyEdit = () => {
    if (!editingId) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === editingId ? { ...m, content: trimmed } : m))
    );
    setEditingId(null);
    setInput("");
  };

  const branchStub = () => {
    setMenu(null);
    setStatusText("분기 생성은 준비 중이에요 (스텁)");
    setTimeout(() => setStatusText(null), 1600);
  };

  const displayName = character?.name.split("·")[0]?.trim() ?? "캐릭터";

  return (
    <div className="flex h-full min-w-0 flex-1">
      <div className="flex h-full min-w-0 flex-1 flex-col bg-surface-muted">
        <div className="flex items-center justify-between border-b border-surface-border bg-white px-4 py-3 sm:px-5">
          <button type="button" className="flex min-w-0 items-center gap-1 text-left">
            <h1 className="truncate text-sm font-bold text-gray-900 sm:text-base">
              {headerTitle}
            </h1>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <ModelPicker
              models={models}
              value={selectedModel?.id ?? modelId}
              onChange={setModelId}
              disabled={sending}
            />
            <span className="hidden text-[10px] text-gray-400 lg:inline">
              {selectedModel?.description}
            </span>
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className={cn(
                "rounded-lg p-1.5 hover:bg-surface-soft",
                panelOpen ? "text-send" : "text-gray-500"
              )}
              title="도구 패널"
              aria-label="도구 패널"
            >
              <PanelRight className="h-5 w-5" />
            </button>
            <button type="button" className="rounded-lg p-1.5 hover:bg-surface-soft">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {mode === "character" && (
              <p className="text-center text-[11px] text-gray-400">
                이 대화는 AI로 생성된 가상의 이야기입니다
              </p>
            )}

            {messages.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                mode={mode}
                characterName={displayName}
                characterEmoji={character?.emoji ?? "✨"}
                characterColor={character?.color ?? "#7C3AED"}
                situationImage={settings.situationImage}
                onOpenMenu={(e) => {
                  e.stopPropagation();
                  setMenu({ messageId: m.id, x: e.clientX, y: e.clientY });
                }}
                onRegenerate={() => regenerateMessage(m.id)}
                onEdit={() => startEdit(m)}
                onDelete={() => deleteMessage(m.id)}
              />
            ))}

            {statusText && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-send [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-send [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-send [animation-delay:300ms]" />
                </span>
                {statusText}
              </div>
            )}

            {showChoices && !sending && choices.length > 0 && (
              <RecommendationChoices
                choices={choices}
                disabled={sending}
                onSend={(t) => send(t)}
                onEdit={(t) => {
                  setInput(t);
                  textareaRef.current?.focus();
                }}
              />
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-surface-border bg-white px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-2xl">
            {showTip && mode === "story" && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-gray-900 px-3 py-2 text-xs text-white">
                <span>추천 선택지로 빠르게 전개하거나, 연필로 편집해 보내보세요</span>
                <button type="button" onClick={() => setShowTip(false)} aria-label="닫기">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {editingId && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <span>메시지 수정 중 — 저장하려면 전송을 누르세요</span>
                <button type="button" onClick={() => { setEditingId(null); setInput(""); }}>
                  취소
                </button>
              </div>
            )}

            <div className="rounded-2xl border border-surface-border bg-white p-2 shadow-soft">
              <div className="mb-1 flex flex-wrap items-center gap-1 px-1">
                {mode === "character" ? (
                  <button
                    type="button"
                    disabled={sending || genRecLoading}
                    onClick={generateRecommendations}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand disabled:opacity-40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {genRecLoading
                      ? "생성 중…"
                      : showChoices
                        ? "추천 답변 다시 생성"
                        : "추천 답변 생성"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => {
                      const next = pickMockChoices(seed, Date.now() % 99, mode);
                      setChoices(next);
                      setShowChoices(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand disabled:opacity-40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    추천답변
                  </button>
                )}
                {showChoices && mode === "character" && (
                  <button
                    type="button"
                    onClick={() => setShowChoices(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    추천 답변 편집 닫기
                  </button>
                )}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (editingId) applyEdit();
                      else send(input);
                    }
                  }}
                  rows={2}
                  placeholder="메시지를 입력하세요…"
                  disabled={sending && !editingId}
                  className="max-h-32 min-h-[52px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none disabled:opacity-60"
                />
                {sending ? (
                  <button
                    type="button"
                    onClick={stopGenerating}
                    className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-send text-white transition hover:bg-send-hover"
                    aria-label="생성 중지"
                    title="중지"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => (editingId ? applyEdit() : send(input))}
                    disabled={!input.trim()}
                    className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-send text-white transition hover:bg-send-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={editingId ? "수정 저장" : "전송"}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UtilitiesPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        settings={settings}
        onChange={setSettings}
        mode={mode}
      />

      {menu && (
        <div
          className="fixed z-50 min-w-[140px] overflow-hidden rounded-xl border border-surface-border bg-white py-1 shadow-card"
          style={{ left: Math.min(menu.x, window.innerWidth - 160), top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            label="다시 생성"
            onClick={() => {
              const id = menu.messageId;
              setMenu(null);
              regenerateMessage(id);
            }}
          />
          <MenuItem
            icon={<GitBranch className="h-3.5 w-3.5" />}
            label="분기 (스텁)"
            onClick={branchStub}
          />
          <MenuItem
            icon={<Pencil className="h-3.5 w-3.5" />}
            label="수정"
            onClick={() => {
              const msg = messages.find((m) => m.id === menu.messageId);
              if (msg) startEdit(msg);
            }}
          />
          <MenuItem
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="삭제"
            danger
            onClick={() => deleteMessage(menu.messageId)}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted",
        danger ? "text-red-600" : "text-gray-700"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function MessageRow({
  message,
  mode,
  characterName,
  characterEmoji,
  characterColor,
  situationImage,
  onOpenMenu,
  onRegenerate,
  onEdit,
  onDelete,
}: {
  message: ChatMessage;
  mode: ConversationMode;
  characterName: string;
  characterEmoji: string;
  characterColor: string;
  situationImage: boolean;
  onOpenMenu: (e: MouseEvent) => void;
  onRegenerate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const content = message.content.replace(/\\n/g, "\n");

  if (message.role === "system") {
    return <StateBlock stateText={content} />;
  }

  if (message.role === "user") {
    if (mode === "story") {
      return (
        <div className="group flex items-start justify-end gap-2">
          <button
            type="button"
            onClick={onOpenMenu}
            className="mt-1 rounded p-1 text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-surface-soft hover:text-gray-500"
            aria-label="메시지 메뉴"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <div className="max-w-[85%] rounded-2xl bg-surface-soft px-4 py-2.5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {content}
          </div>
        </div>
      );
    }
    return (
      <div className="group flex items-start justify-end gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          className="mt-2 rounded p-1 text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-surface-soft hover:text-gray-500"
          aria-label="메시지 메뉴"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-surface-dark px-4 py-2.5 text-sm leading-relaxed text-white whitespace-pre-wrap">
          {content}
        </div>
      </div>
    );
  }

  // assistant
  if (mode === "character") {
    return (
      <div className="group flex gap-2.5">
        <AvatarBadge emoji={characterEmoji} color={characterColor} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-semibold text-gray-600">{characterName}</p>
          <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 shadow-soft whitespace-pre-wrap">
            {content}
            {message.streaming && (
              <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-send align-middle" />
            )}
          </div>
          {!message.streaming && (
            <div className="mt-1.5 flex items-center gap-1 opacity-70 transition group-hover:opacity-100">
              <IconBtn title="삭제" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn title="수정" onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn title="다시 생성" onClick={onRegenerate}>
                <RefreshCw className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          )}
        </div>
      </div>
    );
  }

  // story novel-like
  return (
    <div className="group space-y-3">
      <div className="relative">
        <div className="text-[15px] leading-[1.85] text-gray-900 whitespace-pre-wrap">
          {content}
          {message.streaming && (
            <span className="ml-1 inline-block h-3.5 w-1 animate-pulse bg-send align-middle" />
          )}
        </div>
        {!message.streaming && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <IconBtn title="다시 생성" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn title="메뉴" onClick={onOpenMenu}>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        )}
      </div>

      {!message.streaming && situationImage && message.showSceneImage && (
        <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-soft text-gray-400">
          <div className="flex flex-col items-center gap-1 text-xs">
            <ImageIcon className="h-6 w-6" />
            <span>상황 이미지</span>
          </div>
        </div>
      )}

      {!message.streaming && message.state && <StateBlock state={message.state} />}
    </div>
  );
}

function StateBlock({
  state,
  stateText,
}: {
  state?: SceneState;
  stateText?: string;
}) {
  if (stateText) {
    return (
      <div className="rounded-xl bg-surface-dark px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap">
        {stateText.replace(/\\n/g, "\n")}
      </div>
    );
  }
  if (!state) return null;
  const lines = [
    state.time && `[시간] ${state.time}`,
    state.scene && `[장면] ${state.scene}`,
    state.goal && `[목표] ${state.goal}`,
    state.characters && `[인물] ${state.characters}`,
    state.extra && `[상태] ${state.extra}`,
  ].filter(Boolean);
  return (
    <div className="rounded-xl bg-surface-dark px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap">
      {lines.join("\n")}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: (e: MouseEvent) => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="rounded-md p-1.5 text-gray-400 hover:bg-surface-soft hover:text-gray-700"
    >
      {children}
    </button>
  );
}
