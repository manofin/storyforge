import { NextRequest, NextResponse } from "next/server";
import { pickMockChoices, pickMockReply, pickMockState } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const storyId = typeof body.storyId === "string" ? body.storyId : "default";
  const characterId = typeof body.characterId === "string" ? body.characterId : undefined;
  const mode = body.mode === "character" ? "character" : "story";
  const turn = typeof body.turn === "number" ? body.turn : 1;
  const userMessage = typeof body.message === "string" ? body.message : "";
  const seed = mode === "character" ? characterId ?? storyId : storyId;

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && userMessage) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                mode === "character"
                  ? "당신은 한국어 캐릭터 롤플레이 작가입니다. 캐릭터의 행동 서술과 대사가 섞인 2~4문단을 작성하세요. 브랜드명이나 외부 서비스명을 언급하지 마세요."
                  : "당신은 한국어 인터랙티브 스토리 작가입니다. 2~4문단의 서사적 응답을 작성하세요. 브랜드명이나 외부 서비스명을 언급하지 마세요.",
            },
            { role: "user", content: userMessage },
          ],
          temperature: 0.9,
          max_tokens: 500,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return NextResponse.json({
            reply: content,
            choices: pickMockChoices(seed, turn, mode),
            state: mode === "story" ? pickMockState(seed, turn) : undefined,
            source: "openai",
          });
        }
      }
    } catch {
      // fall through to mock
    }
  }

  return NextResponse.json({
    reply: pickMockReply(seed, turn),
    choices: pickMockChoices(seed, turn, mode),
    state: mode === "story" ? pickMockState(seed, turn) : undefined,
    source: "mock",
  });
}
