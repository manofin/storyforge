import { Suspense } from "react";
import StoryPageClient from "@/components/StoryPageClient";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">불러오는 중…</div>}>
      <StoryPageClient />
    </Suspense>
  );
}
