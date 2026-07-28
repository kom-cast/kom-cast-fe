import { type ReactNode } from 'react'

// NOTE: 실제 모바일 기기(대략 sm 브레이크포인트 640px 미만)에서는 그대로 전체
// 화면을 채우고, 그보다 넓은 화면(데스크톱)에서만 360×800 고정 프레임으로
// 가운데 보여줌.
//
// 바깥(outer)과 스크롤 영역(scroller)을 분리한 이유: outer에
// [transform:translateZ(0)]를 줘서 새 containing block을 만들어야 프레임 안의
// position:fixed 요소(하단 내비, 토스트 등)가 실제 브라우저 뷰포트가 아니라 이
// 프레임 기준으로 붙는데, outer 자신이 스크롤 컨테이너까지 겸하면 fixed
// 요소도 absolute처럼 그 스크롤에 같이 딸려 움직여버림(하단 내비가 스크롤하면
// 같이 밀려 올라감). 그래서 outer는 스크롤 없이 크기만 고정하고 overflow는
// hidden으로 잘라내고, 실제 스크롤은 안쪽 scroller가 담당함 — fixed 요소는
// scroller를 건너뛰고 곧장 outer를 containing block으로 잡기 때문에 스크롤과
// 무관하게 프레임 하단/상단에 고정됨.
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className='sm:flex sm:min-h-svh sm:items-center sm:justify-center sm:bg-neutral-200 sm:p-6'>
      <div className='sm:h-200 sm:w-90 sm:overflow-hidden sm:transform-[translateZ(0)]'>
        <div className='sm:h-full sm:w-full sm:overflow-x-hidden sm:overflow-y-auto sm:[&::-webkit-scrollbar]:hidden'>
          {children}
        </div>
      </div>
    </div>
  )
}
