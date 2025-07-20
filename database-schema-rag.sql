-- pgvector 확장 활성화 (벡터 데이터 타입 사용을 위해 필요)
CREATE EXTENSION IF NOT EXISTS vector;

-- 커스텀 봇 테이블 생성
CREATE TABLE custom_bots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT, -- 봇의 행동 지침
  user_id UUID REFERENCES auth.users(id), -- 향후 사용자 인증용
  is_active BOOLEAN DEFAULT true
);

-- 지식 베이스 테이블 생성 (문서 청크 저장)
CREATE TABLE knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  custom_bot_id UUID REFERENCES custom_bots(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB, -- 파일명, 페이지 번호 등
  embedding vector(1536), -- OpenAI text-embedding-ada-002의 차원
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업로드된 파일 기록 테이블
CREATE TABLE uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  custom_bot_id UUID REFERENCES custom_bots(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_custom_bots_user_id ON custom_bots(user_id);
CREATE INDEX idx_custom_bots_active ON custom_bots(is_active);
CREATE INDEX idx_knowledge_base_bot_id ON knowledge_base(custom_bot_id);
CREATE INDEX idx_uploaded_files_bot_id ON uploaded_files(custom_bot_id);

-- 벡터 유사도 검색을 위한 인덱스 (pgvector 확장 필요)
-- Supabase는 기본적으로 pgvector를 지원합니다
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS 정책 설정
ALTER TABLE custom_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- 현재는 모든 사용자가 접근 가능하도록 설정
CREATE POLICY "Everyone can access custom_bots" ON custom_bots FOR ALL USING (true);
CREATE POLICY "Everyone can access knowledge_base" ON knowledge_base FOR ALL USING (true);
CREATE POLICY "Everyone can access uploaded_files" ON uploaded_files FOR ALL USING (true);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_custom_bots_updated_at 
    BEFORE UPDATE ON custom_bots 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 유사도 검색 함수
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding vector(1536),
  bot_id uuid,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE knowledge_base.custom_bot_id = bot_id
    AND 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
$$; 