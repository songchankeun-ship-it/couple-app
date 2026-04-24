import { useState, useRef, useCallback } from 'react'
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
import CoupleTodo from './components/home/CoupleTodo'
import CoupleSavings from './components/home/CoupleSavings'
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
import CoupleStats from './components/more/CoupleStats'

// Onboarding
import CoupleOnboarding from './components/onboarding/CoupleOnboarding'

const TAB_ORDER: TabGroup[] = ['home', 'chat', 'album', 'date', 'more']

function Content({ tab, onNavigate }: { tab: string; onNavigate: (tab: string) => void }) {
  switch (tab) {
    case 'homedash': return <HomeDashboard onNavigate={onNavigate} />
    case 'questions': return <DailyQuestion />
    case 'timeline': return <Timeline />
    case 'todo': return <CoupleTodo />
    case 'savings': return <CoupleSavings />
    case 'chat': return <Chat />
    case 'album': return <Album />
    case 'memories': return <Memories />
    case 'datefeed': return <DateFeed />
    case 'datemap': return <DateMap />
    case 'games': return <CoupleGames />
    case 'calendar': return <CalendarView />
    case 'wishlist': return <Wishlist />
    case 'annivlist': return <AnniversaryList />
    case 'stats': return <CoupleStats />
    case 'settings': return <Settings />
    default: return <HomeDashboard />
  }
}

export default function App() {
  const { data } = useFirebase()
  const layout = APP_LAYOUT
  const [mainTab, setMainTab] = useState<TabGroup>('home')
  const [subTab, setSubTab] = useState('homedash')
  const dirRef = useRef<1 | -1>(1)

  // 온보딩
  if (!data.spaceType) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen relative overflow-x-hidden">
        <CoupleOnboarding />
      </div>
    )
  }

  const handleMainTab = useCallback((tab: TabGroup) => {
    const oldIdx = TAB_ORDER.indexOf(mainTab)
    const newIdx = TAB_ORDER.indexOf(tab)
    dirRef.current = newIdx >= oldIdx ? 1 : -1
    setMainTab(tab)
    const subs = layout.subTabs[tab]
    if (subs?.length) {
      setSubTab(subs[0].id)
    } else {
      setSubTab(tab)
    }
  }, [mainTab, layout.subTabs])

  const handleSubTab = useCallback((id: string) => {
    const currentSubs = layout.subTabs[mainTab] || []
    const oldIdx = currentSubs.findIndex(s => s.id === subTab)
    const newIdx = currentSubs.findIndex(s => s.id === id)
    dirRef.current = newIdx >= oldIdx ? 1 : -1
    setSubTab(id)
  }, [mainTab, subTab, layout.subTabs])

  const currentSubs = layout.subTabs[mainTab] || []
  const dir = dirRef.current

  // Cinematic page transitions
  const pageVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
    }),
  }

  return (
    <div className="app-shell max-w-[480px] mx-auto min-h-screen relative overflow-hidden">
      {/* Sub nav */}
      {currentSubs.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={subTab === 'homedash' ? 'pt-3' : 'pt-4'}
        >
          <SubNav tabs={currentSubs} active={subTab} onChange={handleSubTab} />
        </motion.div>
      )}

      {/* Cinematic page content */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.main
          key={subTab}
          custom={dir}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          className="min-h-[calc(100vh-80px)]"
        >
          <Content tab={subTab} onNavigate={handleSubTab} />
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
