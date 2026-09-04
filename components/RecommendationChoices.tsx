"use client";

import { Pencil } from "lucide-react";

type Props = {
  choices: string[];
  disabled?: boolean;
  onSend: (text: string) => void;
  onEdit: (text: string) => void;
};

export default function RecommendationChoices({ choices, disabled, onSend, onEdit }: Props) {
  if (!choices.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice) => (
        <div key={choice} className="flex items-start gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onEdit(choice)}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-border bg-white text-gray-400 transition hover:bg-surface-soft hover:text-gray-700 disabled:opacity-40"
            title="추천 답변 편집"
            aria-label="추천 답변 편집"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSend(choice)}
            className="min-w-0 flex-1 rounded-2xl border border-surface-border bg-surface-muted px-3.5 py-2.5 text-left text-sm leading-relaxed text-gray-800 transition hover:border-brand/30 hover:bg-brand-50 disabled:opacity-40"
          >
            {choice}
          </button>
        </div>
      ))}
    </div>
  );
}
