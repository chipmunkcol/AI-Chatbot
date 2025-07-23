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

## Vercel 배포

### 1. Vercel 계정 준비

1. [Vercel](https://vercel.com)에 가입합니다.
2. GitHub 계정과 연동합니다.

### 2. 프로젝트 배포

#### 방법 1: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 루트에서 배포
vercel

# 초기 설정 질문에 답변
```

#### 방법 2: Vercel 웹 대시보드 사용

1. [Vercel 대시보드](https://vercel.com/dashboard)에 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. Next.js 프로젝트로 자동 감지됨
5. "Deploy" 클릭

### 3. 환경 변수 설정

배포 후 Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. 프로젝트 → Settings → Environment Variables
2. 다음 환경 변수들을 추가:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI (RAG 기능용)
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 도메인 설정 (선택사항)

1. Vercel 프로젝트 → Settings → Domains
2. 커스텀 도메인 추가 또는 Vercel 제공 도메인 사용

### 5. 자동 배포 설정

- `main` 브랜치에 푸시할 때마다 자동 배포됩니다.
- Pull Request 생성 시 프리뷰 배포가 자동으로 생성됩니다.

### 배포 시 주의사항

1. **Supabase RLS (Row Level Security)**: 프로덕션에서는 적절한 보안 정책을 설정하세요.
2. **API Rate Limiting**: OpenAI API의 사용량 제한을 고려하여 Rate Limiting을 구현하는 것을 권장합니다.
3. **환경별 설정**: 개발/스테이징/프로덕션 환경별로 다른 Supabase 프로젝트를 사용하는 것을 권장합니다.

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

## 생성형 AI 시장 성장과 GPT·LLM·RAG의 핵심 이슈 요약

- **GPT**는 사전 학습된 **대형 언어 모델(LLM)**로, 인간과 유사하게 다양한 텍스트를 생성하고 대화하도록 설계된 자연어처리 AI이다 .
- **LLM의 주요 한계**는 최신 지식 부족, 기관 내부 지식 반영 미흡, 환각현상 등으로, 데이터의 신뢰성 문제가 제기된다 .
- **Fine Tuning**은 과거 데이터 기반 학습이며, 모델 업데이트 시마다 재학습이 필요해 **학습 비용 증가**와 유연성 한계가 있다 .
- **RAG(검색 증강 생성)**는 검색엔진과 연계해 실시간 최신 데이터로 응답을 생성할 수 있으며, 재학습 필요성이 낮아 학습 비용이 절감되고 다양한 쿼리에 유연하게 대응 가능하다 .
- **기업 문서 및 데이터의 다양성**(표, 이미지 등)과 전처리의 어려움으로 인해 문서 인식, 정확한 정보 추출 등에서 추가적인 비용과 정보 신뢰성 저하 문제가 나타난다 .
- 초창기에는 Fine Tuning 방식이 각광받았으나, 최근에는 **환각현상 해결과 실시간 데이터 반영에 강점이 있는 RAG 방식으로 시장의 방향성이 전환되고 있다** .
- 현재 **대다수 AI 프로젝트가 PoC(검증 단계)**에 머물러 있으나, 빠르게 실제 프로젝트로 전환되는 추세이다 .
