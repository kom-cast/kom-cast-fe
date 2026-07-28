# KomCast (komcast-fe)

관심 종목·산업군을 기반으로 오늘의 증시 브리핑을 음성으로 들려주는 개인 맞춤형 오디오 브리핑 웹 앱입니다.

## 주요 기능

- **인트로 & 온보딩**: 서비스 소개 랜딩 → 보유 종목/관심 산업군 2단계 선택 → 완료 화면
- **홈**: 오늘의 브리핑 미리듣기 카드(대사 실시간 하이라이트), 내 종목 시세, 최근 보관함 요약
- **오디오 플레이어**: 전체 화면 재생, 대본-오디오 동기화(단어 단위 하이라이트), 종목/산업군 뱃지 탭으로 구간 이동, 배속 조절, 화면 전환 후에도 재생을 이어가는 미니 플레이어 바
- **보관함**: 지난 브리핑 목록 및 페이지네이션
- **내 종목 / 마이페이지**: 보유 종목·관심 산업군·알림·구독·마이데이터 연동 관리
- **알림**: 브리핑 도착/종목 알림 등 알림 목록 및 읽음 처리
- 데스크톱 화면에서는 360×800 고정 프레임으로, 모바일 화면에서는 전체 화면으로 표시
- PWA 지원(홈 화면 설치, 오프라인 캐싱)

## 기술 스택

- React 19 + TypeScript
- Vite 8
- React Router 7
- TanStack Query 5 (서버 상태 관리)
- Tailwind CSS 4
- axios
- lucide-react
- oxlint, Prettier, Husky + lint-staged

## 폴더 구조

```
src/
├─ components/
│  ├─ device-frame.tsx        데스크톱에서 360×800 고정 프레임으로 감싸는 래퍼
│  ├─ dialogue-bubble-row.tsx 대사 말풍선 + 단어 단위 하이라이트
│  ├─ mascot-bubble.tsx       마스코트 말풍선
│  ├─ home/                   홈 화면(오늘의 브리핑 카드, 내 종목, 최근 보관함 등)
│  ├─ icons/                  로고·마스코트 아이콘
│  ├─ intro/                  인트로 화면(마퀴, 브리핑 프리뷰 카드 등)
│  ├─ layout/                 하단 내비게이션, 미니 플레이어 바
│  ├─ onboarding/             온보딩 단계별 컴포넌트
│  ├─ player/                 플레이어 화면(헤더, 히어로, 컨트롤, 대본 뷰)
│  ├─ settings/                설정 화면 공통 레이아웃
│  ├─ stocks/                  종목 리스트
│  └─ ui/                      버튼·카드·인풋 등 공용 UI
├─ context/
│  ├─ onboarding-context.tsx  온보딩 선택 상태(닉네임, 보유 종목, 관심 산업군)
│  └─ player-context.tsx      브리핑 재생 상태(오디오 엘리먼트, 진행률, 세그먼트 등) 전역 관리
├─ data/                      목업 데이터(종목, 산업군, 브리핑)
├─ lib/
│  ├─ api/
│  │  ├─ client.ts            스프링 백엔드용 axios 인스턴스(apiClient)
│  │  ├─ briefings.ts         브리핑 도메인 타입(BriefingTarget, BriefingSegment 등)
│  │  ├─ briefing-history.ts  브리핑 조회 API + Remote → 도메인 타입 변환(toBriefing)
│  │  ├─ target-names.ts      종목/산업군 code → name 조회 캐시
│  │  ├─ stocks.ts / industries.ts  종목·산업군 조회 API
│  │  ├─ notifications.ts     알림 조회/읽음 처리 API
│  │  └─ tts-client.ts        komcast-tts 직접 호출용(mock 전용, 신규 화면에서 사용 금지)
│  ├─ format-time.ts          시간/날짜 포맷 유틸
│  ├─ mock-briefing.ts        mock 브리핑 생성
│  └─ utils.ts
└─ pages/                     라우트별 페이지 (settings 하위 라우트 포함)
```

## 라우트 구성

| 경로 | 화면 |
| --- | --- |
| `/` | 인트로 |
| `/onboarding` | 온보딩(보유 종목 → 관심 산업군) |
| `/home` | 홈 |
| `/library` | 보관함 |
| `/portfolio` | 내 종목 |
| `/player/:briefingId` | 브리핑 플레이어 (`today` = 오늘의 브리핑) |
| `/my` | 마이페이지 |
| `/notifications` | 알림 |
| `/settings/stocks` | 보유 종목 관리 |
| `/settings/industries` | 관심 산업군 관리 |
| `/settings/subscription` | 구독 플랜 관리 |
| `/settings/notifications` | 알림 설정 |
| `/settings/mydata` | 마이데이터 연동 상태 |

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
