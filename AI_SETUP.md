# AI 타로 리딩 설정 가이드

이 프로젝트는 OpenAI GPT를 사용하여 지능형 타로 카드 해석을 제공합니다.

## 필요한 것

1. **OpenAI API 키**: [OpenAI Platform](https://platform.openai.com)에서 계정을 생성하고 API 키를 발급받아야 합니다.

## 설정 방법

### 1. 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일을 생성하세요
2. `.env.example` 파일을 참고하여 다음과 같이 설정하세요:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 2. OpenAI API 키 발급받기

1. [OpenAI Platform](https://platform.openai.com)에 로그인
2. API Keys 섹션으로 이동
3. "Create new secret key" 클릭
4. 생성된 키를 복사하여 `.env` 파일에 붙여넣기

### 3. API 사용량 확인

- OpenAI API는 사용량에 따라 과금됩니다
- [Usage 페이지](https://platform.openai.com/usage)에서 현재 사용량을 확인할 수 있습니다
- GPT-4o-mini 모델을 사용하여 비용을 최적화했습니다

## 기능

### AI 타로 해석 서비스

- **모델**: GPT-4o-mini (비용 효율적)
- **기능**: 
  - 질문 맥락을 고려한 개인화된 해석
  - 각 카드의 위치별 의미 분석
  - 역방향 카드 해석
  - 실용적인 조언 제공
  - 핵심 메시지 요약

### 오류 처리

- API 키 미설정 시 안내 메시지
- 네트워크 오류 시 재시도 안내
- AI 서비스 장애 시 기본 타로 의미 표시

## 문제 해결

### API 키 관련 오류
```
OpenAI API key is not configured
```
- `.env` 파일이 존재하는지 확인
- API 키가 올바르게 입력되었는지 확인
- 서버를 재시작 (`npm run dev`)

### 네트워크 오류
```
AI 타로 해석을 생성할 수 없습니다
```
- 인터넷 연결 확인
- OpenAI API 서비스 상태 확인
- API 키의 사용량 제한 확인

### 개발 모드에서 테스트

```bash
# 개발 서버 시작
npm run dev

# 타로 리딩 페이지에서 카드 선택 후 AI 해석 확인
```

## 보안 주의사항

- `.env` 파일을 절대로 버전 관리에 포함하지 마세요
- API 키를 코드에 직접 하드코딩하지 마세요
- API 키를 공개 저장소에 업로드하지 마세요