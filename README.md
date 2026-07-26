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
│  ├─ api/             axios 클라이언트 및 API 함수
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

# 3. 환경 변수 설정 (.env 파일 생성)
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# 4. 개발 서버 실행
npm run dev
```

기본적으로 http://localhost:5173 에서 접속할 수 있습니다.

## 환경 변수

| 변수명 | 설명 | 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 백엔드 API 서버 주소 | `http://localhost:8000` |

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 체크 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | oxlint로 코드 검사 |
| `npm run format` | Prettier로 코드 포맷팅 |
| `npm run format:check` | 포맷팅 여부 검사 |
