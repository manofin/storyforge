import type {
  ArchiveItem,
  Character,
  ChatMessage,
  ChatSession,
  GeneratedImage,
  ImageStyle,
  ModelOption,
  Story,
  WorkItem,
} from "./types";

export const MODELS: ModelOption[] = [
  { id: "forge-2", name: "포지챗 2.0", badge: "추천" },
  { id: "forge-lite", name: "포지챗 Lite" },
  { id: "forge-pro", name: "포지챗 Pro" },
];

export const CHARACTER_CATEGORIES = [
  "추천", "신작", "랭킹", "판타지", "로맨스", "현대", "SF", "일상", "공포", "게임",
] as const;

export const CHARACTERS: Character[] = [
  {
    id: "char-aria",
    name: "아리아 · 달빛 사서",
    tagline: "금지된 서고를 지키는 차분한 사서",
    description: "밤마다 열리는 달빛 도서관의 사서. 당신은 우연히 그 문을 열었고, 그녀는 당신의 이름을 이미 알고 있었습니다.",
    category: "판타지",
    tags: ["판타지", "미스터리", "지적"],
    color: "#7C3AED",
    emoji: "📚",
    chatCount: 12480,
    likes: 3201,
  },
  {
    id: "char-reno",
    name: "레노 · 빗속 탐정",
    tagline: "도시를 누비는 냉철한 사설탐정",
    description: "빗소리가 가득한 네온 골목. 레노는 잃어버린 단서 하나를 찾아 당신에게 제안을 건넵니다.",
    category: "현대",
    tags: ["현대", "추리", "느와르"],
    color: "#0EA5E9",
    emoji: "🕵️",
    chatCount: 8920,
    likes: 2104,
  },
  {
    id: "char-mira",
    name: "미라 · 별빛 항해사",
    tagline: "성간 항로를 여는 낙천적 파일럿",
    description: "고장난 성간선에서 눈을 뜬 당신. 미라는 웃으며 손을 내밀고, 다음 행성은 아직 지도에 없다고 말합니다.",
    category: "SF",
    tags: ["SF", "모험", "유머"],
    color: "#F59E0B",
    emoji: "🚀",
    chatCount: 15602,
    likes: 4410,
  },
  {
    id: "char-haeun",
    name: "하은 · 카페 매니저",
    tagline: "비 오는 날의 따뜻한 대화 상대",
    description: "작은 골목 카페의 매니저 하은. 오늘의 시그니처 라떼와 함께, 가벼운 일상을 나눠요.",
    category: "일상",
    tags: ["일상", "힐링", "로맨스"],
    color: "#EC4899",
    emoji: "☕",
    chatCount: 22110,
    likes: 5802,
  },
  {
    id: "char-kael",
    name: "카엘 · 폐허의 검객",
    tagline: "몰락한 왕국의 마지막 수호자",
    description: "잿더미 왕좌 앞에서 카엘이 검을 꽂습니다. 당신은 계약의 증인이자, 어쩌면 배신자가 될지도 모릅니다.",
    category: "판타지",
    tags: ["판타지", "액션", "서사"],
    color: "#DC2626",
    emoji: "⚔️",
    chatCount: 9801,
    likes: 2755,
  },
  {
    id: "char-yuna",
    name: "유나 · 학교 옥상",
    tagline: "방과 후, 바람이 머무는 곳",
    description: "종소리가 끝난 뒤 옥상에서 마주친 유나. 그녀는 도시 야경을 보며 아무 말도 하지 않습니다.",
    category: "로맨스",
    tags: ["로맨스", "청춘", "서정"],
    color: "#8B5CF6",
    emoji: "🌸",
    chatCount: 18440,
    likes: 6120,
  },
  {
    id: "char-noir",
    name: "느와르 · 그림자 상인",
    tagline: "값을 치르면 무엇이든 판다",
    description: "지하 시장 끝의 가게. 느와르는 마스크 너머로 웃으며, 당신이 원하는 것의 값을 묻습니다.",
    category: "공포",
    tags: ["공포", "다크", "선택"],
    color: "#4B5563",
    emoji: "🕯️",
    chatCount: 6402,
    likes: 1908,
  },
  {
    id: "char-pixel",
    name: "픽셀 · 버그 헌터",
    tagline: "게임 세계 안의 수습 디버거",
    description: "로그인한 순간, UI가 깨지고 픽셀이 나타납니다. \"버그를 고칠래요, 아니면 이용할래요?\"",
    category: "게임",
    tags: ["게임", "메타", "코미디"],
    color: "#10B981",
    emoji: "🎮",
    chatCount: 11220,
    likes: 3330,
  },
];

export const STORIES: Story[] = [
  {
    id: "story-moon-library",
    title: "달빛 도서관의 계약",
    summary: "금지된 서고에서 시작된 이름 없는 계약. 사서와 함께 잃어버린 페이지를 되찾으세요.",
    characterId: "char-aria",
    tags: ["판타지", "미스터리"],
    messageCount: 48,
    color: "#7C3AED",
    emoji: "📚",
    isSeries: true,
    seriesTitle: "달빛 연대기",
  },
  {
    id: "story-rain-case",
    title: "빗소리 속의 의뢰",
    summary: "사라진 목격자, 젖은 단서 하나. 레노와 함께 밤의 도시를 수사합니다.",
    characterId: "char-reno",
    tags: ["추리", "현대"],
    messageCount: 32,
    color: "#0EA5E9",
    emoji: "🕵️",
  },
  {
    id: "story-star-route",
    title: "지도에 없는 항로",
    summary: "성간선의 고장 이후, 미라와 떠나는 예측 불가능한 항해.",
    characterId: "char-mira",
    tags: ["SF", "모험"],
    messageCount: 56,
    color: "#F59E0B",
    emoji: "🚀",
    isSeries: true,
    seriesTitle: "별빛 항해일지",
  },
  {
    id: "story-cafe-rain",
    title: "비 오는 날의 라떼",
    summary: "작은 카페에서 이어지는 따뜻한 대화와 작은 비밀.",
    characterId: "char-haeun",
    tags: ["일상", "힐링"],
    messageCount: 21,
    color: "#EC4899",
    emoji: "☕",
  },
  {
    id: "story-ash-throne",
    title: "잿더미 왕좌",
    summary: "몰락한 왕국의 검객과 맺는 위험한 동맹.",
    characterId: "char-kael",
    tags: ["판타지", "액션"],
    messageCount: 67,
    color: "#DC2626",
    emoji: "⚔️",
  },
  {
    id: "story-rooftop",
    title: "옥상의 침묵",
    summary: "방과 후 옥상에서 마주한, 말하지 않은 마음.",
    characterId: "char-yuna",
    tags: ["로맨스", "청춘"],
    messageCount: 39,
    color: "#8B5CF6",
    emoji: "🌸",
  },
];

export const ARCHIVES: ArchiveItem[] = [
  { id: "arch-1", title: "달빛 연대기", count: 3, emoji: "🌙", color: "#7C3AED" },
  { id: "arch-2", title: "도시 느와르", count: 2, emoji: "🌃", color: "#0EA5E9" },
  { id: "arch-3", title: "일상 스케치", count: 4, emoji: "✏️", color: "#EC4899" },
];

export const CHAT_SESSIONS: ChatSession[] = [
  {
    id: "chat-1",
    title: "달빛 도서관의 계약",
    preview: "서고의 문이 천천히 열리며 차가운 공기가…",
    storyId: "story-moon-library",
    emoji: "📚",
    color: "#7C3AED",
    updatedAt: "방금",
  },
  {
    id: "chat-2",
    title: "빗소리 속의 의뢰",
    preview: "레노: 단서가 하나 더 있어요. 따라오세요.",
    storyId: "story-rain-case",
    emoji: "🕵️",
    color: "#0EA5E9",
    updatedAt: "1시간 전",
  },
  {
    id: "chat-3",
    title: "옥상의 침묵",
    preview: "바람만 스치고, 유나는 여전히 말이 없었다.",
    storyId: "story-rooftop",
    emoji: "🌸",
    color: "#8B5CF6",
    updatedAt: "어제",
  },
  {
    id: "chat-4",
    title: "지도에 없는 항로",
    preview: "미라: 좌표가 이상해요. 이건… 새로운 성운?",
    storyId: "story-star-route",
    emoji: "🚀",
    color: "#F59E0B",
    updatedAt: "2일 전",
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "story-moon-library": [
    {
      id: "m1",
      role: "system",
      kind: "context",
      content: "[장면] 달빛이 스며드는 금지 서고\n[인물] 아리아(사서), 당신(방문객)\n[목표] 잃어버린 페이지의 단서를 찾기",
    },
    {
      id: "m2",
      role: "assistant",
      kind: "narrative",
      content:
        "서고의 문이 천천히 열리며 차가운 공기가 흘러나왔다. 책장 사이로 달빛이 가늘게 스며들고, 아리아가 손가락으로 입술을 가리켰다.\n\n\"이름을 부르지 마세요. 이곳에서는 이름이 곧 계약이 됩니다.\"\n\n그녀의 눈동자에 희미한 별자리가 어른거렸다. \"그래도… 당신은 이미 들어와 버렸네요.\"",
    },
  ],
  "story-rain-case": [
    {
      id: "m1",
      role: "system",
      kind: "context",
      content: "[장면] 비 내리는 네온 골목\n[인물] 레노(탐정), 당신(의뢰인)\n[목표] 사라진 목격자의 행방 추적",
    },
    {
      id: "m2",
      role: "assistant",
      kind: "narrative",
      content:
        "빗물이 우산을 두드렸다. 레노는 코트 깃을 올리며 골목 끝의 표지판을 가리켰다.\n\n\"목격자는 여기서 끊겼어요. 그런데…\" 그가 젖은 명함 조각을 들어 보였다. \"뒷면에 당신 이니셜이 있네요.\"",
    },
  ],
  "story-star-route": [
    {
      id: "m1",
      role: "system",
      kind: "context",
      content: "[장면] 고장난 성간선 조종석\n[인물] 미라(파일럿), 당신(승객)\n[목표] 안전한 항로 재설정",
    },
    {
      id: "m2",
      role: "assistant",
      kind: "narrative",
      content:
        "경고음이 꺼지고, 창밖으로 낯선 성운이 펼쳐졌다. 미라가 헬멧을 벗으며 활짝 웃었다.\n\n\"축하해요! 공식 항로에서 완전히 이탈했네요. 이제부터가 진짜 여행이에요.\"",
    },
  ],
  "story-cafe-rain": [
    {
      id: "m1",
      role: "system",
      kind: "context",
      content: "[장면] 비 오는 골목 카페\n[인물] 하은(매니저), 당신(손님)\n[분위기] 따뜻함, 일상의 여유",
    },
    {
      id: "m2",
      role: "assistant",
      kind: "narrative",
      content:
        "유리창에 빗방울이 흘렀다. 하은이 김 모락모락 나는 라떼를 테이블에 내려놓으며 살짝 웃었다.\n\n\"오늘은 시그니처예요. 비 오는 날엔 달달한 게 제일이거든요. 잠깐 앉아 계실래요?\"",
    },
  ],
  "story-ash-throne": [
    {
      id: "m1",
      role: "system",
      kind: "context",
      content: "[장면] 폐허가 된 왕좌의 방\n[인물] 카엘(검객), 당신(계약자)\n[목표] 왕국의 잔존 세력과 동맹 여부 결정",
    },
    {
      id: "m2",
      role: "assistant",
      kind: "narrative",
      content:
        "재가 바람에 흩날렸다. 카엘이 검 끝을 왕좌에 박고 당신을 바라보았다.\n\n\"말이 필요 없다면, 검으로 증명하세요. 말이 필요하다면… 진실을 말하세요.\"",
    },
  ],
  "story-rooftop": [
    {
      id: "m1",
      role: "system",
      kind: "context",
      content: "[장면] 학교 옥상, 노을\n[인물] 유나, 당신\n[분위기] 청춘, 말하지 않은 마음",
    },
    {
      id: "m2",
      role: "assistant",
      kind: "narrative",
      content:
        "종소리가 멀리서 잦아들었다. 유나는 난간에 팔을 올리고 도시를 내려다보았다.\n\n바람만 스치고, 그녀는 한참을 침묵했다. 그러다 작게 말했다. \"…아직 안 가도 돼요.\"",
    },
  ],
};

export const SUGGESTED_REPLIES: Record<string, string[]> = {
  "story-moon-library": [
    "조용히 고개만 끄덕인다",
    "\"그럼 계약은 어떻게 맺나요?\"",
    "서고 안쪽을 살핀다",
  ],
  "story-rain-case": [
    "명함 조각을 자세히 본다",
    "\"제가 왜요?\"",
    "골목 반대편을 수색하자고 제안한다",
  ],
  "story-star-route": [
    "\"항법 시스템을 점검해볼게요\"",
    "창밖의 성운을 기록한다",
    "미라에게 농담으로 응수한다",
  ],
  "story-cafe-rain": [
    "라떼에 감사를 전한다",
    "창밖 비를 바라보며 이야기한다",
    "오늘의 추천 디저트를 묻는다",
  ],
  "story-ash-throne": [
    "검을 내려놓고 진실을 말한다",
    "침묵한 채 카엘을 응시한다",
    "동맹의 조건을 먼저 묻는다",
  ],
  "story-rooftop": [
    "옆에 조용히 선다",
    "\"오늘은 왜 여기 있어요?\"",
    "도시 야경을 함께 바라본다",
  ],
};

export const MOCK_REPLY_TEMPLATES: string[] = [
  "당신의 말에 공기가 조금 달라졌다.\n\n상대는 잠시 당신을 바라보다가, 천천히 다음 동작을 이어갔다. \"그렇다면… 이쪽이에요.\"\n\n선택의 무게가 어깨에 내려앉았지만, 이야기는 분명 앞으로 흘러가고 있었다.",
  "짧은 침묵이 흘렀다.\n\n멀리서 작은 소리가 들렸고, 상황이 한 겹 더 깊어지는 기분이었다. \"괜찮아요. 천천히 가도 돼요.\"\n\n당신은 숨을 고르며, 다음 한 걸음을 준비했다.",
  "예상치 못한 반응이 돌아왔다.\n\n상대의 표정이 미세하게 풀리거나, 혹은 굳어졌다. \"그걸 말한 사람은… 당신뿐이에요.\"\n\n대화의 결이 바뀌었고, 새로운 갈래가 열렸다.",
  "주변의 공기가 다시 움직이기 시작했다.\n\n발소리, 바람, 희미한 빛. 모든 것이 다음 장면을 암시했다. \"준비됐나요?\"\n\n당신은 대답 대신, 혹은 대답으로, 앞으로 나아갔다.",
];

export const WORKS: WorkItem[] = [
  {
    id: "work-1",
    title: "달빛 사서 · 프롤로그",
    type: "story",
    visibility: "public",
    status: "published",
    emoji: "📚",
    color: "#7C3AED",
    updatedAt: "2026-09-01",
  },
  {
    id: "work-2",
    title: "레노 (탐정)",
    type: "character",
    visibility: "public",
    status: "published",
    emoji: "🕵️",
    color: "#0EA5E9",
    updatedAt: "2026-08-28",
  },
  {
    id: "work-3",
    title: "옥상 스케치",
    type: "story",
    visibility: "private",
    status: "draft",
    emoji: "🌸",
    color: "#8B5CF6",
    updatedAt: "2026-09-03",
  },
  {
    id: "work-4",
    title: "픽셀 (버그 헌터)",
    type: "character",
    visibility: "unlisted",
    status: "unregistered",
    emoji: "🎮",
    color: "#10B981",
    updatedAt: "2026-08-20",
  },
];

export const IMAGE_STYLES: ImageStyle[] = [
  { id: "anime", name: "애니메", description: "선명한 선과 채색", color: "#F472B6" },
  { id: "watercolor", name: "수채화", description: "부드러운 번짐", color: "#60A5FA" },
  { id: "cinematic", name: "시네마틱", description: "영화적 조명", color: "#A78BFA" },
  { id: "pixel", name: "픽셀", description: "레트로 도트", color: "#34D399" },
  { id: "sketch", name: "스케치", description: "연필 선화", color: "#9CA3AF" },
  { id: "noir", name: "느와르", description: "고대비 흑백", color: "#4B5563" },
];

export const SAMPLE_IMAGES: GeneratedImage[] = [
  {
    id: "img-1",
    prompt: "달빛 아래의 고서 도서관, 은은한 보라빛",
    styleId: "cinematic",
    color: "#7C3AED",
    ratio: "1:1",
    liked: true,
  },
  {
    id: "img-2",
    prompt: "비 내리는 네온 골목, 탐정의 실루엣",
    styleId: "noir",
    color: "#0EA5E9",
    ratio: "16:9",
    liked: false,
  },
  {
    id: "img-3",
    prompt: "성간선 창밖의 황금 성운",
    styleId: "anime",
    color: "#F59E0B",
    ratio: "3:4",
    liked: true,
  },
  {
    id: "img-4",
    prompt: "카페 창가의 라떼와 빗방울",
    styleId: "watercolor",
    color: "#EC4899",
    ratio: "1:1",
    liked: false,
  },
];

export const HASH_TAGS = [
  "#판타지", "#로맨스", "#SF", "#일상", "#추리", "#힐링", "#모험", "#청춘",
];
