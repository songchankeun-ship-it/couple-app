import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from './contexts/FirebaseContext'
import { APP_LAYOUT } from './config/spaceConfig'
import type { TabGroup } from './config/spaceConfig'
import BottomNav from './components/layout/BottomNav'
import SubNav from './components/layout/SubNav'

// Core tabs
import HomeDashboard from './components/home/HomeDashboard'
import DailyQuestion from './components/chat/DailyQuestion'
import Timeline from './components/home/Timeline'
import Chat from './components/chat/Chat'
import Album from './components/record/Album'
import { Memories } from './components/record/RecordFeatures'
import DateFeed from './components/date/DateFeed'
import DateMap from './components/date/DateMap'
import CoupleGames from './components/fun/CoupleGames'
import CalendarView from './components/calendar/CalendarView'
import { Wishlist } from './components/calendar/CalendarFeatures'
import AnniversaryList from './components/home/AnniversaryList'
import Settings from './components/more/Settings'

// Onboarding
import CoupleOnboarding from './components/onboarding/CoupleOnboarding'

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
}

const pageTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

function Content({ tab }: { tab: string }) {
  switch (tab) {
    case 'homedash': return <HomeDashboard />
    case 'questions': return <DailyQuestion />
    case 'timeline': return <Timeline />
    case 'chat': return <Chat />
    case 'album': return <Album />
    case 'memories': return <Memories />
    case 'datefeed': return <DateFeed />
    case 'datemap': return <DateMap />
    case 'games': return <CoupleGames />
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

  // 온보딩
  if (!data.spaceType) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen relative overflow-hidden">
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
      setSubTab(tab)
    }
  }

  const currentSubs = layout.subTabs[mainTab] || []

  return (
    <div className="max-w-[480px] mx-auto min-h-screen relative overflow-hidden">
      {/* Sub nav */}
      {currentSubs.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={subTab === 'homedash' ? 'pt-3' : 'pt-4'}
        >
          <SubNav tabs={currentSubs} active={subTab} onChange={setSubTab} />
        </motion.div>
      )}

      {/* Page content with animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={subTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          <Content tab={subTab} />
        </motion.main>
      </AnimatePresence>

      <BottomNav
        tabs={layout.bottomTabs}
        active={mainTab}
        onChange={handleMainTab}
      />
    </div>
  )
}
