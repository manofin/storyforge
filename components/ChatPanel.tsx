"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Send,
  Sparkles,
  Slash,
  Asterisk,
  X,
} from "lucide-react";
import {
  INITIAL_MESSAGES,
  MODELS,
  STORIES,
  SUGGESTED_REPLIES,
} from "@/data/fixtures";
import type { ChatMessage } from "@/data/types";
import { cn, pickMockReply } from "@/lib/utils";

type Props = {
  storyId: string;
};

export default function ChatPanel({ storyId }: Props) {
  const story = STORIES.find((s) => s.id === storyId) ?? STORIES[0];
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => INITIAL_MESSAGES[story.id] ?? []
  );
  const [input, setInput] = useState("");
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [showTip, setShowTip] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef(0);

  const suggestions = useMemo(
    () => SUGGESTED_REPLIES[story.id] ?? ["계속한다", "상황을 살핀다", "말을 건다"],
    [story.id]
  );

  useEffect(() => {
    setMessages(INITIAL_MESSAGES[storyId] ?? []);
    setInput("");
    turnRef.current = 0;
  }, [storyId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    turnRef.current += 1;
    const turn = turnRef.current;

    let reply = pickMockReply(storyId, turn);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, turn, message: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.reply === "string" && data.reply.trim()) {
          reply = data.reply;
        }
      }
    } catch {
      // keep local mock reply
    }

    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      kind: "narrative",
      content: reply,
    };
    setMessages((prev) => [...prev, aiMsg]);
    setSending(false);
  };

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-surface-muted">
      <div className="flex items-center justify-between border-b border-surface-border bg-white px-5 py-3">
        <button type="button" className="flex items-center gap-1 text-left">
          <h1 className="text-sm font-bold text-gray-900 sm:text-base">{story.title}</h1>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="appearance-none rounded-full border border-surface-border bg-white py-1.5 pl-3 pr-8 text-xs font-semibold outline-none hover:bg-surface-soft"
              aria-label="모델 선택"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-amber-500">
              ⚡
            </span>
          </div>
          <span className="hidden text-[10px] text-gray-400 sm:inline">{model.badge}</span>
          <button type="button" className="rounded-lg p-1.5 hover:bg-surface-soft">
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
              </span>
              스토리를 이어쓰는 중…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-surface-border bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {showTip && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-gray-900 px-3 py-2 text-xs text-white">
              <span>단축어로 스토리를 빠르게 전개해보세요!</span>
              <button type="button" onClick={() => setShowTip(false)} aria-label="닫기">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="mb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={sending}
                className="rounded-full border border-surface-border bg-surface-muted px-3 py-1.5 text-xs text-gray-700 transition hover:border-brand/30 hover:bg-brand-50 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-2 shadow-soft">
            <div className="mb-1 flex items-center gap-1 px-1">
              <button type="button" className="rounded-lg p-1.5 text-gray-400 hover:bg-surface-soft" title="단축">
                <Asterisk className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-lg p-1.5 text-gray-400 hover:bg-surface-soft" title="명령">
                <Slash className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => suggestions[0] && setInput(suggestions[0])}
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand"
              >
                <Sparkles className="h-3.5 w-3.5" />
                추천답변
              </button>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={2}
                placeholder="메시지를 입력하세요…"
                className="max-h-32 min-h-[52px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={!input.trim() || sending}
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-send text-white transition hover:bg-send-hover disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="전송"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div className="rounded-xl bg-surface-dark px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap">
        {message.content.replace(/\\n/g, "\n")}
      </div>
    );
  }
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm text-white whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="group flex gap-2">
      <button
        type="button"
        className="mt-1 h-6 w-6 shrink-0 rounded text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-surface-soft hover:text-gray-500"
        title="수정"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <div
        className={cn(
          "max-w-[90%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 shadow-soft whitespace-pre-wrap"
        )}
      >
        {message.content.replace(/\\n/g, "\n")}
      </div>
    </div>
  );
}
