export const NAV_TABS = [
  { href: "/", label: "스토리", match: (p: string) => p === "/" || p.startsWith("/story") },
  { href: "/character", label: "캐릭터", match: (p: string) => p.startsWith("/character") },
  { href: "/works", label: "내 작품", match: (p: string) => p.startsWith("/works") },
  { href: "/image", label: "이미지", match: (p: string) => p.startsWith("/image") },
] as const;
