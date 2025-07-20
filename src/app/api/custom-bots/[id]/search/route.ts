import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getEmbedding } from "@/lib/openai";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customBotId = params.id;
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // 커스텀 봇 존재 확인
    const { data: botData, error: botError } = await supabase
      .from("custom_bots")
      .select("id, name, instructions")
      .eq("id", customBotId)
      .single();

    if (botError || !botData) {
      return NextResponse.json(
        { error: "Custom bot not found" },
        { status: 404 }
      );
    }

    // 쿼리에 대한 임베딩 생성
    const queryEmbedding = await getEmbedding(query);

    // 유사한 지식 검색
    const { data: searchResults, error: searchError } = await supabase.rpc(
      "match_knowledge_base",
      {
        query_embedding: queryEmbedding,
        bot_id: customBotId,
        match_threshold: 0.7,
        match_count: 5,
      }
    );

    if (searchError) {
      console.error("Error searching knowledge base:", searchError);
      return NextResponse.json(
        { error: "Failed to search knowledge base" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: searchResults || [],
      botInfo: {
        name: botData.name,
        instructions: botData.instructions,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
