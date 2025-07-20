# AI 챗봇 with 대화 히스토리 & RAG 커스텀 봇

Google Gemini AI를 사용하는 Next.js 기반 챗봇으로, Supabase를 통해 대화 기록을 저장하고 조회할 수 있으며, ChatGPT의 GPTs처럼 커스텀 봇을 만들어 사용할 수 있는 RAG(Retrieval-Augmented Generation) 기능을 제공합니다.

## 주요 기능

- 🤖 Google Gemini AI 실시간 스트리밍 채팅
- 💾 Supabase를 통한 대화 기록 영구 저장
- 📱 반응형 디자인 (모바일/데스크톱 지원)
- 🌙 다크 모드 지원
- 📋 대화 히스토리 사이드바
- 🔄 실시간 스트리밍 응답
- 🧠 **RAG 기능**: 문서 업로드를 통한 커스텀 봇 생성
- 📄 **다양한 파일 형식 지원**: PDF, DOCX, TXT, MD
- 🔍 **지능형 검색**: OpenAI 임베딩을 활용한 의미 기반 검색
- ⚡ **벡터 데이터베이스**: Supabase의 pgvector를 활용한 고속 검색

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API, OpenAI Embeddings API
- **Database**: Supabase (PostgreSQL + pgvector)
- **File Processing**: PDF-parse, Mammoth, Text processing
- **Hosting**: Vercel (추천)

## 설치 및 설정

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd chatbot
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 API URL과 anon key를 확인합니다.
3. SQL Editor에서 `database-schema.sql` 파일의 내용을 먼저 실행합니다.
4. 그 다음 `database-schema-rag.sql` 파일의 내용을 실행하여 RAG 기능을 위한 테이블을 생성합니다.

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI (RAG 기능용)
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. API 키 발급

**Google Gemini API 키:**

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. API 키를 생성하고 `.env.local`에 추가

**OpenAI API 키 (RAG 기능용):**

1. [OpenAI Platform](https://platform.openai.com/api-keys)에 접속
2. API 키를 생성하고 `.env.local`에 추가

### 5. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000에서 애플리케이션을 확인할 수 있습니다.

## 데이터베이스 스키마

### 기본 테이블

- **conversations**: 대화 목록
- **messages**: 메시지 내용

### RAG 기능 테이블

- **custom_bots**: 커스텀 봇 정보
- **knowledge_base**: 문서 청크와 임베딩 저장
- **uploaded_files**: 업로드된 파일 기록

## RAG 커스텀 봇 사용법

### 1. 커스텀 봇 생성

1. 사이드바에서 "커스텀 봇" 탭 선택
2. "새 커스텀 봇 만들기" 클릭
3. 봇 이름, 설명, 행동 지침 입력

### 2. 지식 문서 업로드

1. 지원되는 파일 형식: PDF, DOCX, TXT, MD
2. 파일 크기 제한: 10MB
3. 업로드된 문서는 자동으로 청크 단위로 분할되어 벡터화됩니다

### 3. 커스텀 봇과 대화

1. 생성된 봇을 선택하여 대화 시작
2. 봇은 업로드된 문서의 내용을 바탕으로 답변을 제공합니다
3. 관련 문서가 없는 질문에도 일반적인 AI 응답을 제공합니다

## 주요 기능 설명

### RAG (Retrieval-Augmented Generation)

- 사용자의 질문에 대해 관련 문서를 자동 검색
- OpenAI 임베딩을 통한 의미 기반 검색
- 검색된 컨텍스트를 바탕으로 한 정확한 답변 생성

### 지능형 문서 처리

- PDF, Word, 텍스트 파일 자동 파싱
- 의미 단위 청크 분할 (1000자, 200자 오버랩)
- 벡터 임베딩 생성 및 저장

### 대화 히스토리

- 일반 대화와 커스텀 봇 대화 구분 저장
- 실시간 대화 목록 업데이트
- 탭 기반 UI로 편리한 네비게이션

## 배포

### Vercel 배포 (추천)

1. Vercel에 프로젝트를 연결합니다
2. 환경 변수를 Vercel 대시보드에서 설정합니다:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
3. 자동 배포가 완료됩니다

### 다른 플랫폼

이 프로젝트는 표준 Next.js 애플리케이션이므로 Netlify, Railway 등 다른 플랫폼에서도 배포 가능합니다.

## 개발

### 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # 채팅 API (RAG 통합)
│   │   ├── conversations/             # 대화 관련 API
│   │   └── custom-bots/               # 커스텀 봇 관련 API
│   │       ├── route.ts               # 봇 생성/조회
│   │       └── [id]/
│   │           ├── upload/route.ts    # 파일 업로드
│   │           └── search/route.ts    # RAG 검색
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Chatbot.tsx                    # 메인 챗봇 컴포넌트
│   ├── ChatHistory.tsx                # 히스토리 & 봇 관리 사이드바
│   └── CustomBotCreator.tsx           # 커스텀 봇 생성 모달
└── lib/
    ├── supabase.ts                    # Supabase 클라이언트 설정
    ├── openai.ts                      # OpenAI 임베딩 유틸리티
    └── fileProcessor.ts               # 파일 처리 유틸리티
```

### RAG 파이프라인

1. **문서 업로드** → 파일 형식 검증
2. **텍스트 추출** → PDF/DOCX/TXT 파싱
3. **청크 분할** → 의미 단위로 텍스트 분할
4. **임베딩 생성** → OpenAI API를 통한 벡터화
5. **데이터베이스 저장** → Supabase에 벡터 저장
6. **의미 검색** → 사용자 질문에 대한 유사 문서 검색
7. **컨텍스트 통합** → 검색 결과를 AI 응답에 통합

### 성능 최적화

- **벡터 인덱싱**: pgvector의 IVFFlat 인덱스 사용
- **청크 캐싱**: 임베딩 생성 최적화
- **스트리밍 응답**: 실시간 응답 표시
- **병렬 처리**: 다중 파일 업로드 지원

### 새로운 기능 추가 아이디어

1. **사용자 인증** (Supabase Auth)
2. **팀 워크스페이스** (봇 공유 기능)
3. **고급 파일 지원** (Excel, PowerPoint, 이미지 OCR)
4. **대화 분석** (인사이트 대시보드)
5. **API 통합** (외부 데이터 소스 연결)
6. **다국어 지원** (i18n)
7. **음성 인터페이스** (STT/TTS)

## 비용 정보

### API 사용료

- **Gemini API**: 무료 사용량 제한 있음
- **OpenAI Embeddings**: $0.0001 per 1K tokens
- **Supabase**: 무료 플랜 제공 (제한적)

### 예상 비용 (월 1000개 문서 처리 기준)

- OpenAI 임베딩: ~$5-10
- Supabase 스토리지: ~$0-5
- Vercel 호스팅: 무료 (취미용)

## 문제 해결

### 일반적인 문제들

1. **임베딩 생성 실패**: OpenAI API 키 확인
2. **파일 업로드 실패**: 파일 크기 및 형식 확인
3. **검색 결과 없음**: 임베딩 생성 완료 후 재시도
4. **데이터베이스 연결 실패**: Supabase 설정 확인

## 라이선스

MIT License

## 기여하기

이슈나 풀 리퀘스트를 통해 기여해주세요! 특히 다음 영역에서의 기여를 환영합니다:

- 새로운 파일 형식 지원
- UI/UX 개선
- 성능 최적화
- 다국어 지원
- 테스트 코드 작성
