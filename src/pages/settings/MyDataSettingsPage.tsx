import { useNavigate } from 'react-router-dom'

import { MyDataPreviewCard } from '@/components/mydata/mydata-preview-card'
import { SettingsLayout } from '@/components/settings'

// NOTE: 실제 마이데이터 연동은 아직 없음. 연동하면 어떤 걸 보여줄 수 있는지 미리
// 보여주는 홍보용 목업 화면 — 데이터는 전부 가짜고 실제 API 호출/동의 처리 없음.

export function MyDataSettingsPage() {
  const navigate = useNavigate()

  return (
    <SettingsLayout title='마이데이터 연동'>
      <div className='mb-6 rounded-3xl bg-[#191f28] p-6 text-white'>
        <p className='mb-4 text-xl leading-snug font-extrabold break-keep'>
          흩어진 내 자산,
          <br />
          모아서 관리할 수 있게 도와드릴게요
        </p>

        <div className='mb-4 h-px bg-white/10' />

        <p className='mb-2 text-sm font-bold'>연결 전에 확인해요</p>
        <ul className='mb-5 space-y-1.5 text-xs leading-relaxed text-white/60'>
          <li>
            · 마이데이터로 정보를 연결하기 전에 신중하게 고민하고 필요한
            서비스만 이용해주세요.
          </li>
          <li>
            · 안 쓰는 서비스에서는 언제든지 정보를 지울 수 있으니 안심하세요.
          </li>
        </ul>

        <div className='flex items-center gap-2.5'>
          <button
            type='button'
            onClick={() => navigate('/my')}
            className='flex-1 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white/70 hover:bg-white/15'
          >
            다음에
          </button>
          <button
            type='button'
            className='flex-1 rounded-2xl bg-brand py-3.5 text-sm font-bold text-white'
          >
            동의하고 연결
          </button>
        </div>
      </div>

      <div className='mb-6'>
        <MyDataPreviewCard />
      </div>

      <div className='mb-6 space-y-3'>
        <p className='text-[13px] font-semibold text-foreground'>
          연동하면 뭐가 달라지나요?
        </p>
        <div className='space-y-2 text-[13px] text-[#8b95a1]'>
          <p>· 여러 계좌를 각각 앱을 열지 않고 한 곳에서 확인해요</p>
          <p>· 보유 종목을 매번 직접 등록하지 않아도 자동으로 채워져요</p>
          <p>· 실제 보유 비중에 맞춰 브리핑에서 다루는 비중도 조정돼요</p>
        </div>
      </div>

      <div className='rounded-2xl bg-muted/50 p-4 text-center'>
        <p className='text-sm font-semibold text-foreground'>
          아직 준비 중이에요
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          마이데이터 연동은 곧 만나보실 수 있어요.
        </p>
      </div>
    </SettingsLayout>
  )
}
