import { useState } from 'react'
import { useFirebase } from './contexts/FirebaseContext'
import { APP_LAYOUT } from './config/spaceConfig'
import type { TabGroup } from './config/spaceConfig'
import BottomNav from './components/layout/BottomNav'
import SubNav from './components/layout/SubNav'

// Core tabs
import HomeDashboard from './components/home/HomeDashboard'
import DailyQuestion from './components/chat/DailyQuestion'
import Chat from './components/chat/Chat'
import Album from './components/record/Album'
import { Memories } from './components/record/RecordFeatures'
import DateFeed from './components/date/DateFeed'
import DateMap from './components/date/DateMap'
import CalendarView from './components/calendar/CalendarView'
import { Wishlist } from './components/calendar/CalendarFeatures'
import AnniversaryList from './components/home/AnniversaryList'
import Settings from './components/more/Settings'

// Onboarding (간소화 — 커플 전용)
import CoupleOnboarding from './components/onboarding/CoupleOnboarding'

function Content({ tab }: { tab: string }) {
  switch (tab) {
    case 'homedash': return <HomeDashboard />
    case 'questions': return <DailyQuestion />
    case 'chat': return <Chat />
    case 'album': return <Album />
    case 'memories': return <Memories />
    case 'datefeed': return <DateFeed />
    case 'datemap': return <DateMap />
    case 'calendar': return <CalendarView />
    case 'wishlist': return <Wishlist />
    case 'annivlist': return <AnniversaryList />
    case 'settings': return <Settings />
    default: return <HomeDashboard />
  }
}

export default function App() {
  const { data } = useFirebase()
  const layout = APP_LAYOUT
  const [mainTab, setMainTab] = useState<TabGroup>('home')
  const [subTab, setSubTab] = useState('homedash')

  // 온보딩: 커플 전용
  if (!data.spaceType) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen relative">
        <CoupleOnboarding />
      </div>
    )
  }

  const handleMainTab = (tab: TabGroup) => {
    setMainTab(tab)
    const subs = layout.subTabs[tab]
    if (subs?.length) {
      setSubTab(subs[0].id)
    } else {
      // 서브탭이 없는 경우 (채팅)
      setSubTab(tab)
    }
  }

  const currentSubs = layout.subTabs[mainTab] || []

  return (
    <div className="max-w-[480px] mx-auto min-h-screen relative">
      {currentSubs.length > 1 && (
        <div className={subTab === 'homedash' ? 'pt-3' : 'pt-4'}>
          <SubNav tabs={currentSubs} active={subTab} onChange={setSubTab} />
        </div>
      )}
      <main>
        <Content tab={subTab} />
      </main>
      <BottomNav
        tabs={layout.bottomTabs}
        active={mainTab}
        onChange={handleMainTab}
      />
    </div>
  )
}
