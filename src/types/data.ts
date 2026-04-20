// 커플 전용 (관계유형 시스템 제거, 하위호환 유지)
export type SpaceType = 'couple'

export const SPACE_PRESETS: Record<SpaceType, { label: string; emoji: string; desc: string; color: string }> = {
  couple: { label: '커플', emoji: '💑', desc: '우리 둘만의 공간', color: '#EC4899' },
}

export interface CoupleData {
  spaceType?: SpaceType
  spaceName?: string
  names: { me: string; you: string }
  members?: string[]
  ddayDate: string | null
  events: CalendarEvent[]
  birthdays: Birthday[]
  wishes: WishItem[]
  spots: SpotItem[]
  memos: Memo[]
  roulette: { categories: Record<string, string[]>; history: string[] }
  moods: { today: Record<string, number>; history: MoodEntry[] }
  savings: SavingsItem[]
  questions: { daily: Record<string, { me?: string; you?: string }>; history: any[] }
  memories: Memory[]
  missions: Mission[]
  timecapsules: Timecapsule[]
  watchlist: WatchlistItem[]
  balance: Record<string, any>
  chat: ChatMessage[]
  album: AlbumPhoto[]
  mbti: { me?: string; you?: string }
  loveLang: { me?: string; you?: string }
  streak: { current: number; lastDate: string | null; best: number }
  weeklyReport: Record<string, any>
  garden: { feeds: number; lastFeed: string | null }
  rewards: Record<string, any>
  couplePhoto?: string
  todos?: TodoItem[]
  polls?: PollItem[]
  budget?: BudgetItem[]
  checklist?: ChecklistItem[]
  vendors?: VendorItem[]
  roles?: RoleItem[]
  timelineEntries?: TimelineEntry[]
  gameHistory?: GameResult[]
}

export interface TimelineEntry {
  title: string
  date: string
  emoji: string
  detail?: string
  type: 'manual'
}

export interface GameResult {
  type: string
  date: string
  score?: number
  answers?: any
}

export interface TodoItem {
  title: string
  done: boolean
  assignee?: string
  dueDate?: string
  category?: string
}

export interface PollItem {
  question: string
  options: string[]
  votes: Record<string, string>
  createdAt: string
}

export interface BudgetItem {
  title: string
  amount: number
  paid?: boolean
  paidBy?: string
  category?: string
  date: string
}

export interface ChecklistItem {
  title: string
  checked: boolean
  category?: string
}

export interface VendorItem {
  name: string
  category: string
  phone?: string
  note?: string
  price?: number
  confirmed?: boolean
}

export interface RoleItem {
  name: string
  role: string
  tasks?: string[]
}

export interface CalendarEvent {
  title: string
  date: string
  note?: string
  color?: string
}

export interface Birthday {
  name: string
  date: string
  relation?: string
  group?: string
}

export interface WishItem {
  title: string
  price?: string
  link?: string
  url?: string
  done?: boolean
}

export interface SpotItem {
  name: string
  address?: string
  note?: string
  category?: string
  rating?: number
  visited?: boolean
}

export interface Memo {
  title?: string
  body?: string
  text?: string
  date: string
  from?: string
}

export interface MoodEntry {
  date: string
  na?: number
  you?: number
}

export interface SavingsDeposit {
  amount: number
  from: string
  date: string
  note?: string
}

export interface SavingsItem {
  title: string
  target: number
  current: number
  date: string
  emoji?: string
  deposits?: SavingsDeposit[]
}

export interface Memory {
  title: string
  date: string
  desc?: string
  photos?: string[]
}

export interface Mission {
  title: string
  done?: boolean
  completed?: boolean
  category?: string
  points?: number
  custom?: boolean
}

export interface Timecapsule {
  message: string
  openDate: string
  from: string
  createdAt: string
  opened?: boolean
}

export interface WatchlistItem {
  title: string
  type: string
  watched?: boolean
  rating?: number
}

export interface ChatMessage {
  text: string
  from: string
  time: string
  date: string
}

export interface AlbumPhoto {
  src: string
  caption?: string
  date?: string
}

export const DEFAULT_DATA: CoupleData = {
  spaceType: undefined,
  spaceName: undefined,
  names: { me: '', you: '' },
  members: [],
  ddayDate: null,
  events: [],
  birthdays: [],
  wishes: [],
  spots: [],
  memos: [],
  roulette: { categories: {}, history: [] },
  moods: { today: {}, history: [] },
  savings: [],
  questions: { daily: {}, history: [] },
  memories: [],
  missions: [],
  timecapsules: [],
  watchlist: [],
  balance: {},
  chat: [],
  album: [],
  mbti: {},
  loveLang: {},
  streak: { current: 0, lastDate: null, best: 0 },
  weeklyReport: {},
  garden: { feeds: 0, lastFeed: null },
  rewards: {},
  couplePhoto: undefined,
  todos: [],
  polls: [],
  budget: [],
  checklist: [],
  vendors: [],
  roles: [],
  timelineEntries: [],
  gameHistory: [],
}
