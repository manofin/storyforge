"use client";

import { useMemo, useState } from "react";
import { IMAGE_STYLES, SAMPLE_IMAGES } from "@/data/fixtures";
import { cn } from "@/lib/utils";
import { Heart, ImagePlus, Library, Sparkles } from "lucide-react";

export default function ImageStudio() {
  const [tab, setTab] = useState<"create" | "vary">("create");
  const [side, setSide] = useState<"library" | "liked">("library");
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState(IMAGE_STYLES[0].id);
  const [ratio, setRatio] = useState("1:1");
  const [count, setCount] = useState(2);
  const [images, setImages] = useState(SAMPLE_IMAGES);
  const [generating, setGenerating] = useState(false);

  const filtered = useMemo(() => {
    if (side === "liked") return images.filter((i) => i.liked);
    return images;
  }, [images, side]);

  const generate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 700));
    const style = IMAGE_STYLES.find((s) => s.id === styleId) ?? IMAGE_STYLES[0];
    const next = Array.from({ length: count }).map((_, i) => ({
      id: `gen-${Date.now()}-${i}`,
      prompt: prompt.trim(),
      styleId,
      color: style.color,
      ratio,
      liked: false,
    }));
    setImages((prev) => [...next, ...prev]);
    setGenerating(false);
  };

  const toggleLike = (id: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, liked: !img.liked } : img)));
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-desktop flex-col md:flex-row">
      <div className="flex gap-2 border-b border-surface-border bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          onClick={() => setSide("library")}
          className={cn(
            "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold",
            side === "library" ? "bg-brand-50 text-brand" : "bg-surface-muted text-gray-600"
          )}
        >
          <Library className="h-4 w-4" />
          라이브러리
        </button>
        <button
          type="button"
          onClick={() => setSide("liked")}
          className={cn(
            "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold",
            side === "liked" ? "bg-brand-50 text-brand" : "bg-surface-muted text-gray-600"
          )}
        >
          <Heart className="h-4 w-4" />
          좋아요
        </button>
      </div>
      <aside className="hidden w-56 shrink-0 border-r border-surface-border bg-white p-3 md:block">
        <button
          type="button"
          onClick={() => setSide("library")}
          className={cn(
            "mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold",
            side === "library" ? "bg-brand-50 text-brand" : "text-gray-600 hover:bg-surface-muted"
          )}
        >
          <Library className="h-4 w-4" />
          라이브러리
        </button>
        <button
          type="button"
          onClick={() => setSide("liked")}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold",
            side === "liked" ? "bg-brand-50 text-brand" : "text-gray-600 hover:bg-surface-muted"
          )}
        >
          <Heart className="h-4 w-4" />
          좋아요
        </button>
        <div className="mt-4 space-y-2 overflow-y-auto">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-surface-border"
              style={{ background: `linear-gradient(135deg, ${img.color}33, ${img.color}88)` }}
            >
              <div className="flex h-20 items-center justify-center text-2xl">🎨</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-gray-400">이미지가 없습니다</p>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("create")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-bold",
              tab === "create" ? "bg-brand text-white" : "bg-white text-gray-600 ring-1 ring-surface-border"
            )}
          >
            신규 생성
          </button>
          <button
            type="button"
            onClick={() => setTab("vary")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-bold",
              tab === "vary" ? "bg-brand text-white" : "bg-white text-gray-600 ring-1 ring-surface-border"
            )}
          >
            이미지 변형
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-surface-border bg-white p-4 shadow-soft">
          <label className="mb-2 block text-xs font-bold text-gray-500">
            {tab === "create" ? "프롬프트" : "변형 프롬프트"}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="그리고 싶은 장면을 적어 주세요…"
            className="w-full resize-none rounded-xl border border-surface-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-brand/40 focus:bg-white"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-gray-500">
              비율
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="ml-2 rounded-lg border border-surface-border bg-white px-2 py-1 text-sm"
              >
                {["1:1", "3:4", "4:3", "16:9"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-gray-500">
              개수
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="ml-2 rounded-lg border border-surface-border bg-white px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={generate}
              disabled={generating || !prompt.trim()}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? "생성 중…" : "생성하기"}
            </button>
          </div>
        </div>

        <h2 className="mb-3 text-sm font-bold text-gray-700">이미지 스타일</h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {IMAGE_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyleId(s.id)}
              className={cn(
                "overflow-hidden rounded-2xl border text-left transition",
                styleId === s.id ? "border-brand ring-2 ring-brand/20" : "border-surface-border"
              )}
            >
              <div
                className="flex h-20 items-center justify-center text-2xl"
                style={{ background: `linear-gradient(135deg, ${s.color}55, ${s.color})` }}
              >
                🖼️
              </div>
              <div className="bg-white px-2.5 py-2">
                <p className="text-xs font-bold">{s.name}</p>
                <p className="text-[10px] text-gray-400">{s.description}</p>
              </div>
            </button>
          ))}
        </div>

        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
          <ImagePlus className="h-4 w-4" />
          생성 결과
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl border border-surface-border bg-white shadow-soft"
            >
              <div
                className="flex aspect-square items-center justify-center p-4 text-center text-sm font-medium text-white"
                style={{ background: `linear-gradient(145deg, ${img.color}, ${img.color}99)` }}
              >
                <span className="line-clamp-4 drop-shadow">{img.prompt}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-500">
                <span>
                  {IMAGE_STYLES.find((s) => s.id === img.styleId)?.name} · {img.ratio}
                </span>
                <button type="button" onClick={() => toggleLike(img.id)} aria-label="좋아요">
                  <Heart
                    className={cn("h-4 w-4", img.liked ? "fill-brand text-brand" : "text-gray-300")}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
