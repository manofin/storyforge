"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Zap } from "lucide-react";
import type { ModelOption } from "@/data/types";
import { cn } from "@/lib/utils";

type Props = {
  models: ModelOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export default function ModelPicker({ models, value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = models.find((m) => m.id === value) ?? models[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-white py-1.5 pl-3 pr-2 text-xs font-semibold transition",
          disabled ? "cursor-not-allowed opacity-50" : "hover:bg-surface-soft"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        <span>{selected?.name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card"
        >
          {models.map((m) => {
            const active = m.id === selected?.id;
            return (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 px-3.5 py-3 text-left transition hover:bg-surface-muted",
                  active && "bg-brand-50/60"
                )}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xs">
                  {m.tier === "pro" ? "♥" : m.tier === "basic" ? "☺" : "⚡"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{m.name}</span>
                    {m.badge && (
                      <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{m.description}</p>
                </div>
                {active && <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
