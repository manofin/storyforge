import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">검색 중…</div>}>
      <SearchResults />
    </Suspense>
  );
}
