import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
}

// 텍스트를 청크로 분할하는 함수
export function splitTextIntoChunks(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    // 현재 청크에 문장을 추가했을 때 최대 크기를 초과하는 경우
    if (
      currentChunk.length + trimmedSentence.length > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());

      // 오버랩을 위해 현재 청크의 마지막 부분을 가져옴
      const words = currentChunk.split(" ");
      const overlapWords = words.slice(-Math.floor(overlap / 5)); // 대략적인 오버랩
      currentChunk = overlapWords.join(" ") + " " + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? ". " : "") + trimmedSentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 50); // 너무 짧은 청크 제거
}
