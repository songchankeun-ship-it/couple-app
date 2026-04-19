// 커플앱 전용 - 단일 레이아웃 (관계유형 시스템 제거)

export type TabGroup = 'home' | 'chat' | 'album' | 'date' | 'more'

interface TabItem {
  id: string
  label: string
}

interface BottomTabItem {
  id: TabGroup
  label: string
  icon: string
}

interface AppLayout {
  bottomTabs: BottomTabItem[]
  subTabs: Record<TabGroup, TabItem[]>
}

export const APP_LAYOUT: AppLayout = {
  bottomTabs: [
    { id: 'home', label: '홈', icon: 'heart' },
    { id: 'chat', label: '채팅', icon: 'chat' },
    { id: 'album', label: '앨범', icon: 'image' },
    { id: 'date', label: '데이트', icon: 'mappin' },
    { id: 'more', label: '더보기', icon: 'more' },
  ],
  subTabs: {
    home: [
      { id: 'homedash', label: '✨ 홈' },
      { id: 'questions', label: '❓ 오늘의 질문' },
      { id: 'timeline', label: '📜 타임라인' },
    ],
    chat: [],
    album: [
      { id: 'album', label: '🖼️ 앨범' },
      { id: 'memories', label: '📸 추억' },
    ],
    date: [
      { id: 'datefeed', label: '💡 추천' },
      { id: 'datemap', label: '📍 우리 지도' },
    ],
    more: [
      { id: 'games', label: '🎮 게임' },
      { id: 'calendar', label: '📅 캘린더' },
      { id: 'wishlist', label: '🎁 위시' },
      { id: 'annivlist', label: '💝 기념일' },
      { id: 'settings', label: '⚙️ 설정' },
    ],
  },
}

export function getLayout(): AppLayout {
  return APP_LAYOUT
}
