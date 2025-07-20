import pdf from "pdf-parse";
import mammoth from "mammoth";

// PDF 파일 텍스트 추출
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    return data.text.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Word 문서 텍스트 추출
export async function extractTextFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error("Error extracting text from Word document:", error);
    throw new Error("Failed to extract text from Word document");
  }
}

// 텍스트 파일 처리
export async function extractTextFromTextFile(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text.trim();
  } catch (error) {
    console.error("Error reading text file:", error);
    throw new Error("Failed to read text file");
  }
}

// 파일 형식에 따라 텍스트 추출
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  } else if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return await extractTextFromWord(file);
  } else if (
    fileType === "text/plain" ||
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md")
  ) {
    return await extractTextFromTextFile(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

// 지원되는 파일 형식인지 확인
export function isSupportedFileType(file: File): boolean {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const supportedExtensions = [".pdf", ".docx", ".txt", ".md"];

  return (
    supportedTypes.includes(fileType) ||
    supportedExtensions.some((ext) => fileName.endsWith(ext))
  );
}
