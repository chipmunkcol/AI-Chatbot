# AI 챗봇 프로젝트

Google Gemini AI 기반의 Next.js 챗봇 애플리케이션입니다. 대화 내역을 저장하고, 문서를 업로드해서 커스텀 봇을 만들 수 있습니다.

[배포 링크](https://ai-chatbot-ten-sand-72.vercel.app/)

## 핵심 기능

- **실시간 채팅**: Google Gemini AI 스트리밍 응답
- **대화 기록**: Supabase로 채팅 히스토리 저장
- **커스텀 봇**: 문서 업로드로 나만의 AI 봇 생성 (RAG)
- **다양한 파일 지원**: PDF, Word, 텍스트, 마크다운

## 기술 스택

- **프론트엔드**: Next.js 14, TypeScript, Tailwind CSS
- **AI**: Google Gemini API, OpenAI Embeddings
- **데이터베이스**: Supabase (PostgreSQL + pgvector)
- **배포**: Vercel

## 주요 기능 설명

### RAG (검색 기반 생성)

업로드한 문서에서 관련 내용을 찾아서 더 정확한 답변을 제공합니다.

1. 문서 업로드 → 텍스트 추출
2. 문서를 작은 단위로 분할
3. OpenAI로 임베딩 생성
4. 질문 시 관련 문서 검색
5. 검색 결과를 바탕으로 답변 생성

## 참고 자료

### RAG vs Fine-tuning 비교

**RAG의 장점:**
- 실시간 최신 정보 반영
- 재학습 없이 새로운 데이터 추가 가능
- 비용 효율적
- 환각 현상 감소

**Fine-tuning의 한계:**
- 과거 데이터 기반 학습
- 업데이트마다 재학습 필요
- 높은 학습 비용
- 유연성 부족

최근 AI 업계는 Fine-tuning에서 RAG 방식으로 전환하는 추세입니다.
