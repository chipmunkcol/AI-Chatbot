# AI 챗봇 with 대화 히스토리

Google Gemini AI를 사용하는 Next.js 기반 챗봇으로, Supabase를 통해 대화 기록을 저장하고 조회할 수 있습니다.

## 주요 기능

- 🤖 Google Gemini AI 실시간 스트리밍 채팅
- 💾 Supabase를 통한 대화 기록 영구 저장
- 📱 반응형 디자인 (모바일/데스크톱 지원)
- 🌙 다크 모드 지원
- 📋 대화 히스토리 사이드바
- 🔄 실시간 스트리밍 응답

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API
- **Database**: Supabase (PostgreSQL)
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
3. SQL Editor에서 `database-schema.sql` 파일의 내용을 실행합니다.

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Google Gemini API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. API 키를 생성하고 `.env.local`에 추가

### 5. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000에서 애플리케이션을 확인할 수 있습니다.

## 데이터베이스 스키마

### Conversations 테이블

- `id`: UUID (Primary Key)
- `title`: 대화 제목
- `created_at`: 생성 시간
- `updated_at`: 수정 시간
- `user_id`: 사용자 ID (향후 인증 기능용)

### Messages 테이블

- `id`: UUID (Primary Key)
- `conversation_id`: 대화 ID (Foreign Key)
- `content`: 메시지 내용
- `sender`: 발신자 ('user' 또는 'bot')
- `created_at`: 생성 시간

## 주요 기능 설명

### 대화 히스토리

- 왼쪽 사이드바에서 이전 대화들을 확인할 수 있습니다
- 새 대화 버튼으로 새로운 대화를 시작할 수 있습니다
- 각 대화는 자동으로 데이터베이스에 저장됩니다

### 실시간 스트리밍

- AI 응답이 실시간으로 스트리밍되어 표시됩니다
- 응답 생성 중에는 타이핑 인디케이터가 표시됩니다

### 반응형 디자인

- 모바일에서는 햄버거 메뉴를 통해 히스토리를 토글할 수 있습니다
- 데스크톱에서는 고정 사이드바로 표시됩니다

## 배포

### Vercel 배포 (추천)

1. Vercel에 프로젝트를 연결합니다
2. 환경 변수를 Vercel 대시보드에서 설정합니다
3. 자동 배포가 완료됩니다

### 다른 플랫폼

이 프로젝트는 표준 Next.js 애플리케이션이므로 Netlify, Railway 등 다른 플랫폼에서도 배포 가능합니다.

## 개발

### 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # 채팅 API
│   │   └── conversations/          # 대화 관련 API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Chatbot.tsx                 # 메인 챗봇 컴포넌트
│   └── ChatHistory.tsx             # 히스토리 사이드바
└── lib/
    └── supabase.ts                 # Supabase 클라이언트 설정
```

### 새로운 기능 추가

1. 사용자 인증 (Supabase Auth)
2. 대화 검색 기능
3. 대화 내보내기/가져오기
4. 사용자별 설정
5. 다국어 지원

## 라이선스

MIT License

## 기여하기

이슈나 풀 리퀘스트를 통해 기여해주세요!
