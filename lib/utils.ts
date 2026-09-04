import { clsx, type ClassValue } from "clsx";

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
];

export function pickMockReply(seed: string, turn: number): string {
  let hash = 0;
  const key = `${seed}:${turn}`;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return REPLY_POOL[hash % REPLY_POOL.length];
}
