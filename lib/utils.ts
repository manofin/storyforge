import { clsx, type ClassValue } from "clsx";
import type { SceneState } from "@/data/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return String(n);
}

const REPLY_POOL = [
  "당신의 말에 공기가 조금 달라졌다.\n\n상대는 잠시 당신을 바라보다가, 천천히 다음 동작을 이어갔다. \"그렇다면… 이쪽이에요.\"\n\n선택의 무게가 어깨에 내려앉았지만, 이야기는 분명 앞으로 흘러가고 있었다.",
  "짧은 침묵이 흘렀다.\n\n멀리서 작은 소리가 들렸고, 상황이 한 겹 더 깊어지는 기분이었다. \"괜찮아요. 천천히 가도 돼요.\"\n\n당신은 숨을 고르며, 다음 한 걸음을 준비했다.",
  "예상치 못한 반응이 돌아왔다.\n\n상대의 표정이 미세하게 풀리거나, 혹은 굳어졌다. \"그걸 말한 사람은… 당신뿐이에요.\"\n\n대화의 결이 바뀌었고, 새로운 갈래가 열렸다.",
  "주변의 공기가 다시 움직이기 시작했다.\n\n발소리, 바람, 희미한 빛. 모든 것이 다음 장면을 암시했다. \"준비됐나요?\"\n\n당신은 대답 대신, 혹은 대답으로, 앞으로 나아갔다.",
  "시선이 마주친 순간, 상대의 호흡이 조금 흐트러졌다.\n\n\"…그건 예상 못 했어요.\" 낮은 목소리가 공간에 남았다.\n\n당신은 그 반응을 단서로 삼아, 다음 선택을 가늠했다.",
];

const CHOICE_POOLS: Record<string, string[][]> = {
  default: [
    ["상황을 조금 더 살핀다", "솔직하게 속마음을 말한다", "한 걸음 다가가 본다"],
    ["잠시 침묵을 지킨다", "\"그래서 다음은 뭐죠?\"", "주변을 둘러보며 단서를 찾는다"],
    ["부드럽게 농담을 건넨다", "상대의 손을 잠깐 붙잡는다", "뒤로 한 걸음 물러선다"],
  ],
  "story-moon-library": [
    ["조용히 고개만 끄덕인다", "\"그럼 계약은 어떻게 맺나요?\"", "서고 안쪽을 살핀다"],
    ["이름을 부르지 않겠다고 약속한다", "달빛이 닿는 책장을 가리킨다", "\"이미 들어온 이상, 돌아갈 수 없겠죠\""],
    ["아리아의 표정을 주의 깊게 본다", "금지된 페이지에 손을 뻗는다", "계약의 대가를 먼저 묻는다"],
  ],
  "story-rain-case": [
    ["명함 조각을 자세히 본다", "\"제가 왜요?\"", "골목 반대편을 수색하자고 제안한다"],
    ["우산을 레노에게 살짝 기울인다", "\"목격자가 남긴 흔적이 더 있을 거예요\"", "근처 CCTV를 떠올린다"],
    ["젖은 바닥의 발자국을 쫓는다", "레노에게 솔직한 의심을 털어놓는다", "카페로 자리를 옮기자고 한다"],
  ],
  "story-star-route": [
    ["\"항법 시스템을 점검해볼게요\"", "창밖의 성운을 기록한다", "미라에게 농담으로 응수한다"],
    ["비상 전력을 우선 복구하자고 한다", "\"지도에 없다면, 우리가 그리면 되죠\"", "헬멧을 다시 쓴다"],
    ["미라의 활력을 따라가며 웃는다", "센서 로그를 다시 읽는다", "다음 행성의 이름을 지어본다"],
  ],
  "story-cafe-rain": [
    ["라떼에 감사를 전한다", "창밖 비를 바라보며 이야기한다", "오늘의 추천 디저트를 묻는다"],
    ["자리를 조금 더 부탁한다", "\"이런 날엔 카페가 제일이에요\"", "하은의 하루를 가볍게 묻는다"],
    ["창가 자리를 제안한다", "시그니처의 레시피를 궁금해한다", "빗소리를 들으며 침묵을 나눈다"],
  ],
  "story-ash-throne": [
    ["검을 내려놓고 진실을 말한다", "침묵한 채 카엘을 응시한다", "동맹의 조건을 먼저 묻는다"],
    ["왕좌의 재를 한 줌 집어 든다", "\"배신이 아니라면, 무엇이 증명인가요?\"", "카엘의 옆을 지킨다"],
    ["계약서를 요구한다", "검끝을 피해 한 걸음 옆으로 선다", "폐허 너머의 불빛을 가리킨다"],
  ],
  "story-rooftop": [
    ["옆에 조용히 선다", "\"오늘은 왜 여기 있어요?\"", "도시 야경을 함께 바라본다"],
    ["가방에서 캔커피를 꺼내 건넨다", "난간에 팔꿈치를 올린다", "\"아직 가도 된다고 하지 않았어요\""],
    ["바람 소리만 듣는다", "유나의 어깨에 살짝 기대본다", "내일의 등교길을 묻는다"],
  ],
};

const CHAR_CHOICE_POOLS: Record<string, string[][]> = {
  default: [
    ["\"오늘은 기분이 어때요?\"", "가벼운 미소를 보낸다", "요즘 있었던 일을 이야기한다"],
    ["\"잠깐만 들어줄래요?\"", "상대의 반응을 살핀다", "장난스럽게 말을 건다"],
    ["\"그 말, 조금 더 듣고 싶어요\"", "조용히 곁에 머문다", "화제를 바꿔 본다"],
  ],
};

const STATE_POOL: SceneState[] = [
  {
    time: "해질녘",
    scene: "이야기가 한 겹 깊어진 자리",
    goal: "상대의 다음 선택 유도",
    characters: "당신, 상대",
  },
  {
    time: "밤",
    scene: "공기가 바뀐 공간",
    goal: "숨겨진 단서 확인",
    characters: "당신, 상대",
  },
  {
    time: "이른 아침",
    scene: "고요가 남은 장면",
    goal: "관계를 한 단계 진전시키기",
    characters: "당신, 상대",
  },
];

function hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

export function pickMockReply(seed: string, turn: number): string {
  const hash = hashKey(`${seed}:${turn}`);
  return REPLY_POOL[hash % REPLY_POOL.length];
}

export function pickMockChoices(seed: string, turn: number, mode: "story" | "character" = "story"): string[] {
  const pools =
    mode === "character"
      ? CHAR_CHOICE_POOLS[seed] ?? CHAR_CHOICE_POOLS.default
      : CHOICE_POOLS[seed] ?? CHOICE_POOLS.default;
  const hash = hashKey(`choices:${seed}:${turn}`);
  return pools[hash % pools.length];
}

export function pickMockState(seed: string, turn: number): SceneState {
  const hash = hashKey(`state:${seed}:${turn}`);
  const base = STATE_POOL[hash % STATE_POOL.length];
  return {
    ...base,
    extra: turn > 1 ? `최근 행동 #${turn} 반영됨` : undefined,
  };
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulate chunked streaming of text into a callback. */
export async function streamText(
  full: string,
  onChunk: (partial: string) => void,
  opts?: { chunkSize?: number; delayMs?: number; signal?: AbortSignal }
) {
  const chunkSize = opts?.chunkSize ?? 12;
  const delayMs = opts?.delayMs ?? 28;
  let out = "";
  for (let i = 0; i < full.length; i += chunkSize) {
    if (opts?.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    out += full.slice(i, i + chunkSize);
    onChunk(out);
    await sleep(delayMs);
  }
  return out;
}
