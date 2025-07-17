import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message, chatHistory } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 채팅 히스토리를 Gemini 형식으로 변환
    // Gemini API는 히스토리가 user 역할로 시작해야 하므로 초기 봇 메시지 제외
    let history =
      chatHistory
        ?.filter(
          (msg: any) =>
            !(
              msg.sender === "bot" &&
              msg.text.includes("Gemini AI와 함께하는 챗봇입니다")
            )
        )
        .map((msg: any) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })) || [];

    // 히스토리가 비어있거나 model로 시작하는 경우 빈 히스토리로 시작
    if (history.length === 0 || history[0].role === "model") {
      history = [];
    }

    console.log("Chat history length:", history.length);
    console.log(
      "First message role:",
      history.length > 0 ? history[0].role : "empty"
    );

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessageStream(message);

    // 스트리밍 응답 생성
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            const data = `data: ${JSON.stringify({ text: chunkText })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          // 스트림 종료 신호
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
