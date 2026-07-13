import SettingsLayout from '@/components/settings/settings-layout'

function StubSettingsPage({ title }: { title: string }) {
  return (
    <SettingsLayout title={title}>
      <div className='flex flex-col items-center justify-center gap-2 rounded-2xl bg-muted/50 py-16 text-center'>
        <p className='text-sm font-medium text-foreground'>준비 중이에요</p>
        <p className='text-sm text-muted-foreground'>곧 만나보실 수 있어요</p>
      </div>
    </SettingsLayout>
  )
}

export default StubSettingsPage
