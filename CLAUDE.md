# 뚝딱마니또 (DdakManito)

## 한 줄
종이쪽지 대신 폰으로 안전하게 마니또를 뽑고 익명 칭찬을 주고받는 교실용 웹앱

## 라인업
🌸 **뚝딱 시리즈 파일럿** — 뚝딱 디자인 시스템 검증용 첫 앱

## 스택
- React + Vite + Tailwind CSS
- Firebase (Firestore + Auth)
- Vercel 배포
- 도메인 후보: ddak-manito.kr

## 뚝딱 시리즈 디자인 토큰 (필수 준수)

### 컬러 (파스텔)
- --ddak-cream: #FFF5E1   (배경)
- --ddak-pink: #FFD6E0    (포인트)
- --ddak-mint: #C8E6F5    (서브)
- --ddak-lavender: #E8D5F2 (서브)
- --ddak-text: #4A4A4A    (본문)
- --ddak-accent: #FF8FA3  (강조)

### 폰트
- 제목: Cafe24 Ssurround (둥근 고딕, 무료, webfont)
- 본문: Pretendard
- 포인트: 나눔손글씨 봄봄 (손글씨 강조용)

### 무드
- 둥근 모서리 크게 (rounded-2xl ~ rounded-3xl)
- soft shadow (shadow-lg with 낮은 opacity)
- 부드러운 spring 애니메이션
- 큰 여백, 시원한 레이아웃

## 핵심 라이브러리 (뚝딱 시리즈 시그니처 3종)
1. **framer-motion** — 모든 등장/전환은 spring 물리
2. **lottie-react** — 캐릭터 모션 (LottieFiles 무료 에셋)
3. **canvas-confetti** — 마니또 공개 시 별·하트 폭죽

## 추가 라이브러리
- @phosphor-icons/react (둥근 아이콘)
- react-hot-toast (부드러운 알림)
- firebase

## 핵심 기능 (MVP)
1. **교사 개설**: 학급 만들기 → 초대코드 6자리 생성 → 학생 명단 입력
2. **자동 매칭**: 자기 자신 제외, 작년 짝 제외(옵션) 알고리즘
3. **학생 확인**: 초대코드로 입장 → 본인의 마니또만 비밀로 확인
4. **익명 칭찬함**: 마니또에게 익명 메시지 전달 (교사 검열 후)
5. **교사 대시보드**: 누가 확인했는지/메시지 모니터링
6. **공개 연출**: 마지막 날 카운트다운 + confetti 폭죽

## 안전장치 (교사 안심 포인트)
- 모든 메시지는 교사 검토 대기열에 먼저 들어감
- 욕설/뒷담 감지 시 자동 보류 (Phase 2: Gemini API)
- 익명이지만 교사는 발신자 확인 가능

## 폴더 구조
```
src/
├─ components/
│  ├─ ddak/              ← 뚝딱 시리즈 공통 컴포넌트
│  │  ├─ DdakButton.jsx
│  │  ├─ DdakCard.jsx
│  │  ├─ DdakHeader.jsx
│  │  └─ DdakConfetti.jsx
│  └─ manito/            ← 마니또 전용
├─ pages/
│  ├─ Home.jsx           ← 랜딩
│  ├─ TeacherSetup.jsx   ← 교사 개설
│  ├─ StudentJoin.jsx    ← 학생 입장
│  ├─ MyManito.jsx       ← 내 마니또 확인
│  ├─ MessageBox.jsx     ← 익명 메시지
│  └─ Reveal.jsx         ← 공개 연출
├─ lib/
│  ├─ firebase.js
│  ├─ matching.js        ← 매칭 알고리즘
│  └─ tokens.js          ← 디자인 토큰
└─ App.jsx
```

## 금지사항
- ❌ 푸터 제거 금지
- ❌ 인라인 스타일 금지 (Tailwind만)
- ❌ 채도 높은 원색 사용 금지 (파스텔만)
- ❌ 각진 모서리 금지 (rounded-xl 이상)
- ❌ console.log 프로덕션 잔류 금지

## 필수 푸터
```jsx
<footer className="text-center text-sm text-gray-400 py-6">
  © 2026 <a href="https://mumuclass.kr" className="hover:text-pink-400">무궁무진클래스</a> · 용쌤
</footer>
```

## 작업 규칙 (클코에게)
- 한 번에 한 단계씩 진행하고 사용자 확인 받기
- 금지사항 절대 위반 금지
- 코드 짤 때마다 "왜 이렇게 했는지" 한 줄 설명
- 1단계 끝나면 npm run dev로 띄울 수 있는 상태로 만들기

## 상세 스펙
docs/SPEC.md 참조 (Phase 2)

## 글로벌 규칙 상속
~/.claude/CLAUDE.md 참조
