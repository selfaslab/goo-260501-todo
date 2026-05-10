# goorm-260501-todo

Todoist 스타일의 할 일 앱입니다. **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**로 구성되어 있으며, 데이터는 **localStorage**에 저장됩니다.

## 기능

- **뷰**: Inbox, Today, Upcoming
- **할 일**: 추가, 수정(제목 더블클릭), 삭제, 완료 체크
- **분류**: 프로젝트(Inbox / Work / Personal), 우선순위(P1, P2, P3), 마감일

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

### Windows PowerShell에서 `npm` 실행 정책 오류가 날 때

```powershell
npm.cmd run dev
```

또는 실행 정책을 완화합니다.

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 빌드

```bash
npm run build
npm run start
```

## 프로젝트 구조

| 경로 | 설명 |
|------|------|
| `src/app/page.tsx` | 메인 화면 레이아웃 |
| `src/store/useStore.ts` | Zustand 스토어 + persist(localStorage) |
| `src/types/index.ts` | 타입 정의 |
| `src/components/Sidebar.tsx` | 사이드바(뷰·프로젝트) |
| `src/components/TaskInput.tsx` | 작업 입력 |
| `src/components/TaskList.tsx` | 필터된 목록 |
| `src/components/TaskItem.tsx` | 단일 작업 행 |

## 라이선스

Private 프로젝트입니다.
