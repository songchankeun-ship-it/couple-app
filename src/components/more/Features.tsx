import { useState } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'

// ===== BALANCE GAME =====
const BALANCE_QUESTIONS = [
  { a: '해외 여행', b: '국내 캠핑' }, { a: '아침형 인간', b: '밤형 인간' },
  { a: '매운 음식', b: '달달한 음식' }, { a: '영화관', b: '넷플릭스' },
  { a: '바다', b: '산' }, { a: '고양이', b: '강아지' },
  { a: '여름', b: '겨울' }, { a: '카페', b: '술집' },
  { a: '도시', b: '시골' }, { a: '전화', b: '문자' },
  { a: '계획적', b: '즉흥적' }, { a: '집데이트', b: '밖데이트' },
]

export function BalanceGame() {
  const { data, updateData } = useFirebase()
  const [qIdx, setQIdx] = useState(0)
  const q = BALANCE_QUESTIONS[qIdx % BALANCE_QUESTIONS.length]
  const myChoice = data.balance?.[qIdx]?.me || data.balance?.[`q${qIdx}_me`]
  const yourChoice = data.balance?.[qIdx]?.you || data.balance?.[`q${qIdx}_you`]

  const choose = (who: 'me' | 'you', choice: 'a' | 'b') => {
    updateData(prev => ({
      ...prev,
      balance: { ...prev.balance, [qIdx]: { ...prev.balance?.[qIdx], [who]: choice }, [`q${qIdx}_${who}`]: choice }
    }))
  }

  const match = myChoice && yourChoice ? myChoice === yourChoice : null

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-6 text-center mb-4">
        <div className="text-xs text-gray-400 font-bold mb-4">Q{qIdx + 1}</div>
        <div className="flex gap-3 mb-4">
          <button onClick={() => choose('me', 'a')} className={`flex-1 py-5 rounded-2xl text-[15px] font-bold transition-all border-2 ${myChoice === 'a' ? 'bg-gradient-to-br from-mint-bg to-teal-light/30 border-teal text-teal-dark' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>{q.a}</button>
          <div className="flex items-center text-gray-300 font-bold text-xs">VS</div>
          <button onClick={() => choose('me', 'b')} className={`flex-1 py-5 rounded-2xl text-[15px] font-bold transition-all border-2 ${myChoice === 'b' ? 'bg-gradient-to-br from-mint-bg to-teal-light/30 border-teal text-teal-dark' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>{q.b}</button>
        </div>
        {match !== null && (
          <div className={`py-3 rounded-xl text-sm font-bold ${match ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
            {match ? '✨ 취향이 같아요!' : '🤔 서로 다르네요!'}
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setQIdx(i => Math.max(0, i - 1))} disabled={qIdx === 0} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm disabled:opacity-30">← 이전</button>
        <button onClick={() => setQIdx(i => i + 1)} className="px-4 py-2 rounded-xl bg-teal text-white font-bold text-sm">다음 →</button>
      </div>
    </div>
  )
}

// ===== FORTUNE =====
const FORTUNES = [
  '오늘 상대방에게 먼저 연락하면 좋은 일이!', '달달한 디저트가 행운을 가져다줄 거예요',
  '오늘은 셀카 찍기 좋은 날! 추억을 남겨보세요', '상대방의 장점을 3개 말해주면 사랑이 깊어져요',
  '산책 데이트가 기분을 업시켜줄 거예요', '오늘의 행운 색은 민트! 민트색 아이템을 착용해보세요',
  '상대방에게 감사한 점을 편지로 써보세요', '함께 새로운 음식을 시도해보면 행운이!',
  '오늘은 스킨십을 많이 하면 좋은 날이에요', '서프라이즈 선물이 관계를 더 특별하게 만들어줄 거예요',
]

export function Fortune() {
  const today = new Date()
  const dayIdx = Math.floor((today.getTime() - new Date(2024, 0, 1).getTime()) / 86400000)
  const fortune = FORTUNES[dayIdx % FORTUNES.length]
  const score = 70 + (dayIdx % 30)

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-8 text-center bg-gradient-to-br from-amber-50/80 to-orange-50/50">
        <div className="text-4xl mb-4">🔮</div>
        <div className="text-xs text-gray-400 font-bold mb-3">{today.getMonth() + 1}월 {today.getDate()}일 커플 운세</div>
        <div className="text-3xl font-black text-amber-600 mb-2">{score}점</div>
        <div className="text-[15px] font-semibold text-gray-700 leading-relaxed px-4">{fortune}</div>
      </div>
    </div>
  )
}

// ===== ROULETTE =====
export function Roulette() {
  const items = ['치킨 🍗', '피자 🍕', '초밥 🍣', '파스타 🍝', '삼겹살 🥩', '떡볶이 🌶️', '햄버거 🍔', '중국집 🥟']
  const [result, setResult] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)

  const spin = () => {
    setSpinning(true)
    setResult(null)
    let count = 0
    const interval = setInterval(() => {
      setResult(items[count % items.length])
      count++
      if (count > 20) { clearInterval(interval); setSpinning(false); setResult(items[Math.floor(Math.random() * items.length)]) }
    }, 80)
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">{spinning ? '🎰' : '🎲'}</div>
        <div className={`text-3xl font-black mb-6 min-h-[48px] ${spinning ? 'animate-pulse' : ''}`}>
          {result || '뭐 먹을까?'}
        </div>
        <button onClick={spin} disabled={spinning} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition">
          {spinning ? '돌리는 중...' : '룰렛 돌리기!'}
        </button>
      </div>
    </div>
  )
}

// ===== GARDEN =====
const LEVELS = [
  { name: '새싹', emoji: '🌱', xp: 0, pet: '🐣' },
  { name: '떡잎', emoji: '🌿', xp: 50, pet: '🐥' },
  { name: '묘목', emoji: '🌳', xp: 150, pet: '🐕' },
  { name: '꽃나무', emoji: '🌸', xp: 300, pet: '🐈' },
  { name: '열매나무', emoji: '🍎', xp: 500, pet: '🦊' },
  { name: '거목', emoji: '🏔️', xp: 1000, pet: '🦁' },
]

export function Garden() {
  const { data } = useFirebase()
  const xp = (data.chat?.length || 0) * 5 + (data.album?.length || 0) * 10 + (data.memos?.length || 0) * 15 + (data.moods?.history?.length || 0) * 8
  const level = LEVELS.reduce((acc, l, i) => xp >= l.xp ? i : acc, 0)
  const lv = LEVELS[level]
  const nextLv = LEVELS[Math.min(level + 1, LEVELS.length - 1)]
  const progress = level >= LEVELS.length - 1 ? 100 : Math.min(100, Math.round((xp - lv.xp) / (nextLv.xp - lv.xp) * 100))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card overflow-hidden mb-4">
        <div className="h-[200px] bg-gradient-to-b from-sky-200 via-sky-100 to-green-200 relative flex items-end justify-center pb-4">
          <div className="absolute top-4 right-6 text-2xl">☀️</div>
          <div className="absolute top-8 left-[20%] text-sm opacity-50">☁️</div>
          <div className="absolute top-12 left-[60%] text-xs opacity-40">☁️</div>
          <div className="text-center">
            <div className="text-6xl mb-1" style={{ animation: 'treeBreeze 4s ease-in-out infinite', transformOrigin: 'bottom center' }}>{lv.emoji}</div>
            <div className="text-3xl absolute bottom-6 left-8" style={{ animation: 'petWalk 3s ease-in-out infinite' }}>{lv.pet}</div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{lv.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-800">Lv.{level + 1} {lv.name}</div>
              <div className="text-xs text-gray-400">펫: {lv.pet}</div>
            </div>
            <div className="text-right text-xs font-bold text-teal">{xp} XP</div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-light to-teal rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[10px] text-gray-400 mt-1 text-right">{xp} / {nextLv.xp} XP</div>
        </div>
      </div>
    </div>
  )
}

// ===== WEEKLY REPORT =====
export function WeeklyReport() {
  const { data } = useFirebase()
  const today = new Date()
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7)
  const ws = weekAgo.toISOString().split('T')[0]
  const chatCount = data.chat.filter(c => (c.date || (c.time || '').split(' ')[0].replace(/\./g, '-')) >= ws).length
  const moodCount = data.moods.history.filter(m => m.date >= ws).length
  const albumCount = data.album.filter(a => (a.date || '') >= ws).length
  const score = Math.min(100, chatCount * 3 + moodCount * 10 + albumCount * 15)
  const grade = score >= 80 ? 'S' : score >= 60 ? 'A' : score >= 40 ? 'B' : score >= 20 ? 'C' : 'D'
  const gradeColor = score >= 80 ? '#38B2AC' : score >= 60 ? '#38A169' : score >= 40 ? '#ECC94B' : '#E53E3E'

  const tips = []
  if (chatCount < 5) tips.push('💬 대화가 적었어요. 오늘 안부 한마디 보내보세요!')
  if (moodCount < 3) tips.push('😊 기분 기록을 더 자주 해보세요')
  if (albumCount === 0) tips.push('📸 이번 주 사진이 없어요! 셀카 한 장?')
  if (tips.length === 0) tips.push('🏆 완벽한 한 주! 이 페이스 유지!')

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-6 text-center mb-4">
        <div className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center mx-auto mb-3" style={{ borderColor: gradeColor }}>
          <div className="text-3xl font-black" style={{ color: gradeColor }}>{grade}</div>
          <div className="text-xs text-gray-500 font-bold">{score}점</div>
        </div>
        <div className="text-sm font-bold text-gray-800">{score >= 60 ? '좋은 한 주였어요!' : '조금 더 힘내봐요!'}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[{ e: '💬', n: chatCount, l: '대화' }, { e: '😊', n: moodCount, l: '기분' }, { e: '📸', n: albumCount, l: '사진' }].map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className="text-xl mb-1">{s.e}</div>
            <div className="text-lg font-black text-gray-800">{s.n}</div>
            <div className="text-[10px] text-gray-400 font-bold">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {tips.map((t, i) => (
          <div key={i} className="glass-card p-4 text-sm text-gray-600">{t}</div>
        ))}
      </div>
    </div>
  )
}

// ===== MISSIONS =====
const DEFAULT_MISSIONS = [
  '손잡고 30분 산책하기', '셀카 찍기', '요리 함께 하기', '편지 쓰기',
  '새로운 카페 가기', '영화 같이 보기', '서로에게 칭찬 3개씩', '데이트 계획 세우기',
  '상대방 좋아하는 음식 만들기', '함께 운동하기', '서프라이즈 이벤트', '추억 앨범 만들기',
]

export function Missions() {
  const { data, updateData } = useFirebase()
  if (!data.missions.length) {
    updateData(prev => ({ ...prev, missions: DEFAULT_MISSIONS.map(title => ({ title, done: false })) }))
  }
  const isDone = (m: any) => m.done || m.completed
  const toggle = (idx: number) => {
    updateData(prev => ({
      ...prev,
      missions: prev.missions.map((m, i) => i === idx ? { ...m, done: !isDone(m), completed: !isDone(m) } : m)
    }))
  }
  const done = data.missions.filter(m => isDone(m)).length
  const total = data.missions.length

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-4 mb-4 text-center">
        <div className="text-sm text-gray-500">완료</div>
        <div className="text-2xl font-black text-teal">{done} / {total}</div>
      </div>
      <div className="space-y-2">
        {data.missions.map((m, i) => (
          <div key={i} onClick={() => toggle(i)} className={`glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${isDone(m) ? 'opacity-50' : ''} border-l-[3px]`}
            style={{ borderLeftColor: i % 3 === 0 ? '#38B2AC' : i % 3 === 1 ? '#ECC94B' : '#B794F4', borderRadius: '0 22px 22px 0' }}>
            <span className="text-lg">{isDone(m) ? '✅' : '⬜'}</span>
            <span className={`text-sm font-semibold ${isDone(m) ? 'line-through text-gray-400' : 'text-gray-700'}`}>{m.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== MBTI =====
const MBTI_TYPES = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ']

export function MBTICompat() {
  const { data, updateData } = useFirebase()
  const [selecting, setSelecting] = useState<'me' | 'you' | null>(null)

  const select = (who: 'me' | 'you', type: string) => {
    updateData(prev => ({ ...prev, mbti: { ...prev.mbti, [who]: type } }))
    setSelecting(null)
  }

  const score = data.mbti?.me && data.mbti?.you ? 60 + (data.mbti.me.charCodeAt(0) + data.mbti.you.charCodeAt(0)) % 35 : null

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-6 text-center mb-4">
        <h3 className="text-lg font-black mb-4">🧬 MBTI 궁합</h3>
        <div className="flex items-center justify-center gap-6 mb-4">
          <button onClick={() => setSelecting('me')} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-mint-bg flex items-center justify-center text-lg font-black text-teal border-2 border-teal/20 mb-1">{data.mbti?.me || '?'}</div>
            <div className="text-xs font-bold text-gray-500">{data.names.me || '나'}</div>
          </button>
          <span className="text-2xl animate-heartbeat">💕</span>
          <button onClick={() => setSelecting('you')} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-lg font-black text-pink-600 border-2 border-pink-200 mb-1">{data.mbti?.you || '?'}</div>
            <div className="text-xs font-bold text-gray-500">{data.names.you || '너'}</div>
          </button>
        </div>
        {score && <div className="text-5xl font-black text-teal">{score}%</div>}
      </div>
      {selecting && (
        <div className="glass-card p-4">
          <div className="text-sm font-bold text-gray-500 mb-3 text-center">{selecting === 'me' ? data.names.me || '나' : data.names.you || '너'}의 MBTI 선택</div>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map(t => (
              <button key={t} onClick={() => select(selecting, t)} className="py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700 hover:bg-mint-bg hover:border-teal active:scale-95 transition">{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
