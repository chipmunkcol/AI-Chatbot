import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 커스텀 봇 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("custom_bots")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching custom bots:", error);
      return NextResponse.json(
        { error: "Failed to fetch custom bots" },
        { status: 500 }
      );
    }

    return NextResponse.json({ customBots: data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 새 커스텀 봇 생성
export async function POST(req: NextRequest) {
  try {
    const { name, description, instructions } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("custom_bots")
      .insert([
        {
          name,
          description: description || null,
          instructions: instructions || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating custom bot:", error);
      return NextResponse.json(
        { error: "Failed to create custom bot" },
        { status: 500 }
      );
    }

    return NextResponse.json({ customBot: data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
