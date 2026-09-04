import { NextRequest, NextResponse } from "next/server";
import { pickMockReply } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const storyId = typeof body.storyId === "string" ? body.storyId : "default";
  const turn = typeof body.turn === "number" ? body.turn : 1;
  const userMessage = typeof body.message === "string" ? body.message : "";

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
                "당신은 한국어 인터랙티브 스토리 작가입니다. 2~4문단의 서사적 응답을 작성하세요. 브랜드명이나 외부 서비스명을 언급하지 마세요.",
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
        if (content) return NextResponse.json({ reply: content, source: "openai" });
      }
    } catch {
      // fall through to mock
    }
  }

  return NextResponse.json({
    reply: pickMockReply(storyId, turn),
    source: "mock",
  });
}
