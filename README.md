# KomCast (komcast-fe)

관심 종목·섹터를 기반으로 오늘의 증시 브리핑을 음성으로 들려주는 개인 맞춤형 오디오 브리핑 웹 앱입니다.

## 주요 기능

- 로그인 / 회원가입 및 온보딩(관심 종목·섹터·키워드·음성·브리핑 시간 설정)
- 오늘의 증시 브리핑 홈 화면 및 오디오 플레이어
- 지난 브리핑 보관함
- 마이페이지 및 알림
- 종목/섹터/음성/알림/브리핑 시간 등 세부 설정
- PWA 지원(홈 화면 설치, 오프라인 캐싱)

## 기술 스택

- React 19 + TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- axios
- oxlint, Prettier, Husky + lint-staged

## 폴더 구조

```
src/
├─ assets/            정적 리소스
├─ components/
│  ├─ auth/           로그인·회원가입 레이아웃
│  ├─ icons/           로고·마스코트 등 아이콘
│  ├─ layout/          하단 내비게이션 등 공통 레이아웃
│  ├─ onboarding/      온보딩 단계별 컴포넌트
│  ├─ settings/        설정 화면 레이아웃
│  └─ ui/              버튼·카드·인풋 등 공용 UI
├─ context/            전역 상태(Context) - 온보딩 등
├─ data/               목업 데이터
├─ lib/
│  ├─ api/
│  │  ├─ client.ts            스프링 백엔드용 axios 인스턴스(apiClient)
│  │  ├─ briefings.ts         브리핑 도메인 타입(BriefingTarget, BriefingSegment 등)
│  │  ├─ briefing-history.ts  브리핑 조회 API + Remote → 도메인 타입 변환(toBriefing)
│  │  ├─ target-names.ts      종목/산업군 code → name 조회 캐시
│  │  ├─ stocks.ts / industries.ts  종목·산업군 조회 API
│  │  └─ tts-client.ts        komcast-tts 직접 호출용(mock 전용, 신규 화면에서 사용 금지)
│  └─ utils.ts
└─ pages/               라우트별 페이지 (settings 하위 라우트 포함)
```

## 요구사항

- Node.js 20 이상
- npm 10 이상

## 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/kom-cast/kom-cast-fe.git
cd komcast-fe

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local

# 4. 개발 서버 실행
npm run dev
```

기본적으로 http://localhost:5173 에서 접속할 수 있습니다.

## 환경 변수

`.env.example` 참고. 필요한 값만 `.env.local`에 오버라이드하면 됩니다.

| 변수명 | 설명 | 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | kom-cast-be(Spring Boot) 도메인 API 서버 주소 | `http://localhost:8080` |
| `VITE_TTS_API_BASE_URL` | komcast-tts(FastAPI) 실시간 브리핑 합성 서버 주소 (임시 연동, mock 전용) | `http://localhost:8000` |
| `VITE_USE_MOCK_TODAY_BRIEFING` | `true`면 오늘의 브리핑을 kom-cast-be 대신 komcast-tts를 직접 호출하는 mock으로 받아옴 | `false` |
| `VITE_USER_ID` | 정식 로그인 붙기 전까지 kom-cast-be가 사용자 구분에 쓰는 임시 헤더값 | `1` |

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 체크 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | oxlint로 코드 검사 |
| `npm run format` | Prettier로 코드 포맷팅 |
| `npm run format:check` | 포맷팅 여부 검사 |
