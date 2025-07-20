import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { extractTextFromFile, isSupportedFileType } from "@/lib/fileProcessor";
import { getEmbeddings, splitTextIntoChunks } from "@/lib/openai";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customBotId = params.id;
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isSupportedFileType(file)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload PDF, DOCX, TXT, or MD files.",
        },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "File size too large. Maximum size is 10MB.",
        },
        { status: 400 }
      );
    }

    // 커스텀 봇 존재 확인
    const { data: botData, error: botError } = await supabase
      .from("custom_bots")
      .select("id")
      .eq("id", customBotId)
      .single();

    if (botError || !botData) {
      return NextResponse.json(
        { error: "Custom bot not found" },
        { status: 404 }
      );
    }

    // 업로드된 파일 기록 저장
    const { data: fileRecord, error: fileError } = await supabase
      .from("uploaded_files")
      .insert([
        {
          custom_bot_id: customBotId,
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          processed: false,
        },
      ])
      .select()
      .single();

    if (fileError) {
      console.error("Error saving file record:", fileError);
      return NextResponse.json(
        { error: "Failed to save file record" },
        { status: 500 }
      );
    }

    try {
      // 파일에서 텍스트 추출
      const extractedText = await extractTextFromFile(file);

      if (!extractedText.trim()) {
        throw new Error("No text content found in file");
      }

      // 텍스트를 청크로 분할
      const chunks = splitTextIntoChunks(extractedText, 1000, 200);

      if (chunks.length === 0) {
        throw new Error("No valid text chunks created from file");
      }

      // OpenAI API 키 확인
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
      }

      // 청크들에 대한 임베딩 생성
      const embeddings = await getEmbeddings(chunks);

      // 지식 베이스에 청크들 저장
      const knowledgeEntries = chunks.map((chunk, index) => ({
        custom_bot_id: customBotId,
        content: chunk,
        metadata: {
          filename: file.name,
          fileType: file.type,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
        embedding: embeddings[index],
      }));

      const { error: insertError } = await supabase
        .from("knowledge_base")
        .insert(knowledgeEntries);

      if (insertError) {
        console.error("Error inserting knowledge base entries:", insertError);
        throw new Error("Failed to save knowledge base entries");
      }

      // 파일 처리 완료 표시
      await supabase
        .from("uploaded_files")
        .update({ processed: true })
        .eq("id", fileRecord.id);

      return NextResponse.json({
        message: "File processed successfully",
        chunksProcessed: chunks.length,
        fileId: fileRecord.id,
      });
    } catch (processingError) {
      console.error("Error processing file:", processingError);

      // 파일 기록 삭제 (처리 실패)
      await supabase.from("uploaded_files").delete().eq("id", fileRecord.id);

      return NextResponse.json(
        {
          error: `Failed to process file: ${
            processingError instanceof Error
              ? processingError.message
              : "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
