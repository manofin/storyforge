import { CHARACTERS, HASH_TAGS, STORIES } from "@/data/fixtures";

export type SearchTab = "all" | "story" | "series" | "character" | "account" | "hashtag";

export function searchCatalog(query: string, tab: SearchTab) {
  const q = query.trim().toLowerCase();
  const stories = STORIES.filter(
    (s) =>
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
  );
  const series = stories.filter((s) => s.isSeries);
  const characters = CHARACTERS.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
  const hashtags = HASH_TAGS.filter((h) => !q || h.toLowerCase().includes(q));
  const accounts = [
    { id: "acc-1", name: "스토리포지 공식", handle: "@storyforge", bio: "이야기와 캐릭터를 만드는 공간" },
  ].filter((a) => !q || a.name.includes(query) || a.handle.includes(query));

  return {
    stories: tab === "all" || tab === "story" ? stories : [],
    series: tab === "all" || tab === "series" ? series : [],
    characters: tab === "all" || tab === "character" ? characters : [],
    accounts: tab === "all" || tab === "account" ? accounts : [],
    hashtags: tab === "all" || tab === "hashtag" ? hashtags : [],
    counts: {
      all: stories.length + characters.length + hashtags.length,
      story: stories.length,
      series: series.length,
      character: characters.length,
      account: accounts.length,
      hashtag: hashtags.length,
    },
  };
}
