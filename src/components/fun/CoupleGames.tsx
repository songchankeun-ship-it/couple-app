import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { ArrowLeft } from 'lucide-react'

// ═══════════════════════════════════════
// BALANCE GAME DATA
// ═══════════════════════════════════════
const BALANCE_QUESTIONS = [
  { a: '짜장면', b: '짬뽕', emoji: '🍜' },
  { a: '산', b: '바다', emoji: '🏔️' },
  { a: '여름', b: '겨울', emoji: '☀️' },
  { a: '강아지', b: '고양이', emoji: '🐾' },
  { a: '아침형', b: '올빼미형', emoji: '🌙' },
  { a: '액션 영화', b: '로맨스 영화', emoji: '🎬' },
  { a: '소개팅', b: '자연스러운 만남', emoji: '💕' },
  { a: '집콕', b: '외출', emoji: '🏠' },
  { a: '서프라이즈', b: '미리 알려주기', emoji: '🎁' },
  { a: '전화', b: '문자', emoji: '📱' },
  { a: '돈 많은 미래', b: '시간 많은 미래', emoji: '💰' },
  { a: '첫사랑과 재회', b: '새로운 사랑', emoji: '💘' },
  { a: '맛집 줄서기', b: '근처 아무데나', emoji: '🍽️' },
  { a: '사진 많이', b: '눈에 담기', emoji: '📸' },
  { a: '큰 선물 1개', b: '작은 선물 여러 개', emoji: '🎀' },
]

// ═══════════════════════════════════════
// COMPATIBILITY QUIZ DATA
// ═══════════════════════════════════════
const COMPAT_QUESTIONS = [
  { q: '데이트할 때 주도하는 편이다', icon: '💑' },
  { q: '싸우면 먼저 연락한다', icon: '📱' },
  { q: '기념일을 잘 챙기는 편이다', icon: '🎂' },
  { q: '질투를 잘 한다', icon: '😤' },
  { q: '스킨십을 좋아한다', icon: '🤗' },
  { q: '상대 친구와 잘 어울린다', icon: '👥' },
  { q: '같이 운동하고 싶다', icon: '🏃' },
  { q: '아침에 일어나면 먼저 연락한다', icon: '🌅' },
  { q: '여행 계획은 꼼꼼히 세운다', icon: '✈️' },
  { q: '맛있는 건 나눠먹는 편이다', icon: '🍰' },
]

// ═══════════════════════════════════════
// OX QUIZ DATA
// ═══════════════════════════════════════
const OX_QUESTIONS = [
  { q: '상대방이 가장 좋아하는 음식을 알고 있다', emoji: '🍕' },
  { q: '상대방의 혈액형을 알고 있다', emoji: '🩸' },
  { q: '상대방 친한 친구 이름 3명 이상 안다', emoji: '👥' },
  { q: '상대방이 어릴 때 꿈을 알고 있다', emoji: '⭐' },
  { q: '상대방의 발 사이즈를 안다', emoji: '👟' },
  { q: '상대방이 가장 싫어하는 것을 안다', emoji: '😣' },
  { q: '상대방 부모님 성함을 안다', emoji: '👨‍👩‍👧' },
  { q: '상대방이 즐겨보는 유튜버를 안다', emoji: '📺' },
  { q: '상대방이 무서워하는 것을 안다', emoji: '😱' },
  { q: '상대방의 MBTI를 안다', emoji: '🧠' },
]

type GameType = null | 'balance' | 'compat' | 'ox'

interface GameResult {
  type: string
  date: string
  score?: number
  answers?: any
}

export default function CoupleGames() {
  const { data, updateData } = useFirebase()
  const [game, setGame] = useState<GameType>(null)

  // Balance game state
  const [balanceIdx, setBalanceIdx] = useState(0)
  const [balanceMe, setBalanceMe] = useState<string[]>([])
  const [balanceYou, setBalanceYou] = useState<string[]>([])
  const [balanceTurn, setBalanceTurn] = useState<'me' | 'you'>('me')
  const [balanceDone, setBalanceDone] = useState(false)

  // Compat game state
  const [compatIdx, setCompatIdx] = useState(0)
  const [compatMe, setCompatMe] = useState<boolean[]>([])
  const [compatYou, setCompatYou] = useState<boolean[]>([])
  const [compatTurn, setCompatTurn] = useState<'me' | 'you'>('me')
  const [compatDone, setCompatDone] = useState(false)

  // OX game state
  const [oxIdx, setOxIdx] = useState(0)
  const [oxAnswers, setOxAnswers] = useState<boolean[]>([])
  const [oxDone, setOxDone] = useState(false)

  const gameHistory: GameResult[] = data.gameHistory || []

  const saveResult = (result: GameResult) => {
    updateData(prev => ({
      ...prev,
      gameHistory: [...(prev.gameHistory || []), result],
    }))
  }

  const resetAll = () => {
    setGame(null)
    setBalanceIdx(0); setBalanceMe([]); setBalanceYou([]); setBalanceTurn('me'); setBalanceDone(false)
    setCompatIdx(0); setCompatMe([]); setCompatYou([]); setCompatTurn('me'); setCompatDone(false)
    setOxIdx(0); setOxAnswers([]); setOxDone(false)
  }

  // ── BALANCE GAME ──
  const handleBalance = (choice: string) => {
    if (balanceTurn === 'me') {
      setBalanceMe(prev => [...prev, choice])
      setBalanceTurn('you')
    } else {
      const newYou = [...balanceYou, choice]
      setBalanceYou(newYou)
      if (balanceIdx < BALANCE_QUESTIONS.length - 1) {
        setBalanceIdx(balanceIdx + 1)
        setBalanceTurn('me')
      } else {
        // Calculate match
        const matches = balanceMe.map((a, i) => a === newYou[i]).filter(Boolean).length + (choice === balanceMe[balanceIdx] ? 1 : 0)
        setBalanceDone(true)
        saveResult({ type: 'balance', date: new Date().toISOString().split('T')[0], score: Math.round(matches / BALANCE_QUESTIONS.length * 100) })
      }
    }
  }

  const balanceMatchCount = balanceDone
    ? balanceMe.map((a, i) => a === balanceYou[i]).filter(Boolean).length
    : 0
  const balanceScore = balanceDone ? Math.round(balanceMatchCount / BALANCE_QUESTIONS.length * 100) : 0

  // ── COMPAT QUIZ ──
  const handleCompat = (answer: boolean) => {
    if (compatTurn === 'me') {
      const newMe = [...compatMe, answer]
      setCompatMe(newMe)
      setCompatTurn('you')
    } else {
      const newYou = [...compatYou, answer]
      setCompatYou(newYou)
      if (compatIdx < COMPAT_QUESTIONS.length - 1) {
        setCompatIdx(compatIdx + 1)
        setCompatTurn('me')
      } else {
        const matches = compatMe.map((a, i) => a === newYou[i]).filter(Boolean).length + (answer === compatMe[compatIdx] ? 1 : 0)
        setCompatDone(true)
        saveResult({ type: 'compat', date: new Date().toISOString().split('T')[0], score: Math.round(matches / COMPAT_QUESTIONS.length * 100) })
      }
    }
  }

  const compatMatchCount = compatDone
    ? compatMe.map((a, i) => a === compatYou[i]).filter(Boolean).length
    : 0
  const compatScore = compatDone ? Math.round(compatMatchCount / COMPAT_QUESTIONS.length * 100) : 0

  // ── OX QUIZ ──
  const handleOx = (answer: boolean) => {
    const newAnswers = [...oxAnswers, answer]
    setOxAnswers(newAnswers)
    if (oxIdx < OX_QUESTIONS.length - 1) {
      setOxIdx(oxIdx + 1)
    } else {
      const score = Math.round(newAnswers.filter(Boolean).length / OX_QUESTIONS.length * 100)
      setOxDone(true)
      saveResult({ type: 'ox', date: new Date().toISOString().split('T')[0], score })
    }
  }

  const oxScore = oxDone ? Math.round(oxAnswers.filter(Boolean).length / OX_QUESTIONS.length * 100) : 0

  // ── GAME HUB ──
  if (!game) {
    return (
      <div className="px-4 pb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="py-3">
          <h2 className="text-lg font-black text-gray-800">🎮 커플 미니게임</h2>
          <p className="text-xs text-gray-400 mt-0.5">함께 하면 더 재밌는 게임!</p>
        </motion.div>

        {/* Game history summary */}
        {gameHistory.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">🏆</div>
            <div>
              <div className="text-sm font-bold text-gray-800">{gameHistory.length}번 플레이</div>
              <div className="text-[11px] text-gray-400">
                평균 궁합 {Math.round(gameHistory.reduce((s, g) => s + (g.score || 0), 0) / gameHistory.length)}%
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Cards */}
        <div className="space-y-3">
          {[
            {
              id: 'balance' as GameType,
              emoji: '⚖️',
              title: '밸런스 게임',
              desc: '짜장 vs 짬뽕! 우리의 취향은 얼마나 같을까?',
              gradient: 'from-pink-500 to-rose-500',
              shadow: 'rgba(236,72,153,0.25)',
            },
            {
              id: 'compat' as GameType,
              emoji: '💘',
              title: '궁합 테스트',
              desc: '연애 스타일 10문 10답, 우리 궁합은 몇 %?',
              gradient: 'from-violet-500 to-purple-500',
              shadow: 'rgba(167,139,250,0.25)',
            },
            {
              id: 'ox' as GameType,
              emoji: '🧠',
              title: '상대방 OX 퀴즈',
              desc: '나는 상대방을 얼마나 잘 알고 있을까?',
              gradient: 'from-amber-500 to-orange-500',
              shadow: 'rgba(251,191,36,0.25)',
            },
          ].map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              onClick={() => setGame(g.id)}
              className="glass-card p-5 cursor-pointer overflow-hidden relative"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${g.gradient} opacity-10 rounded-full -mr-8 -mt-8`} />
              <div className="flex items-center gap-4 relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.gradient} flex items-center justify-center text-2xl shadow-[0_4px_16px_${g.shadow}]`}
                >
                  {g.emoji}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-extrabold text-gray-800">{g.title}</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">{g.desc}</p>
                </div>
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-gray-300 text-lg">→</motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ── BACK BUTTON ──
  const BackBar = ({ title }: { title: string }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 py-3">
      <motion.button whileTap={{ scale: 0.9 }} onClick={resetAll}
        className="w-10 h-10 rounded-xl glass-card-solid flex items-center justify-center">
        <ArrowLeft size={20} className="text-gray-600" />
      </motion.button>
      <span className="text-base font-black text-gray-800">{title}</span>
    </motion.div>
  )

  // ── RESULT SCREEN ──
  const ResultScreen = ({ score, matchCount, total, title }: { score: number; matchCount?: number; total: number; title: string }) => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-7xl mb-4"
      >
        {score >= 80 ? '💕' : score >= 50 ? '😊' : '🤔'}
      </motion.div>
      <div className="text-sm font-bold text-gray-500 mb-2">{title} 결과</div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        className="text-6xl font-black gradient-text mb-2"
      >
        {score}%
      </motion.div>
      {matchCount !== undefined && (
        <div className="text-sm text-gray-500 mb-6">{total}개 중 {matchCount}개 일치!</div>
      )}
      <div className="glass-card p-4 text-center mb-6 max-w-xs">
        <div className="text-[14px] font-bold text-gray-700">
          {score >= 90 ? '환상의 커플이에요! 찰떡궁합 💯' :
           score >= 70 ? '꽤 잘 맞는 편이에요! 👍' :
           score >= 50 ? '다른 점이 매력이 되기도 해요 😊' :
           '오히려 좋아! 서로 새로운 걸 알아가는 재미 🌈'}
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.95 }} onClick={resetAll}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-[0_8px_24px_rgba(236,72,153,0.25)]">
        돌아가기
      </motion.button>
    </motion.div>
  )

  // ── BALANCE GAME SCREEN ──
  if (game === 'balance') {
    const q = BALANCE_QUESTIONS[balanceIdx]
    const progress = (balanceIdx + (balanceTurn === 'you' ? 0.5 : 0)) / BALANCE_QUESTIONS.length
    return (
      <div className="px-4 pb-24">
        <BackBar title="⚖️ 밸런스 게임" />
        {balanceDone ? (
          <ResultScreen score={balanceScore} matchCount={balanceMatchCount} total={BALANCE_QUESTIONS.length} title="밸런스 게임" />
        ) : (
          <motion.div key={`${balanceIdx}-${balanceTurn}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                <span>{balanceIdx + 1} / {BALANCE_QUESTIONS.length}</span>
                <span className="gradient-text">{balanceTurn === 'me' ? (data.names.me || '나') : (data.names.you || '너')} 차례</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress * 100}%` }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
              </div>
            </div>

            {/* Question */}
            <div className="glass-card p-8 text-center mb-6">
              <span className="text-4xl mb-4 block">{q.emoji}</span>
              <div className="text-[13px] text-gray-400 font-bold mb-6">
                {balanceTurn === 'me' ? (data.names.me || '나') : (data.names.you || '너')}의 선택은?
              </div>
              <div className="flex gap-3">
                {[q.a, q.b].map((choice) => (
                  <motion.button
                    key={choice}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBalance(choice)}
                    className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/10 text-[16px] font-extrabold text-gray-800 hover:border-primary/30 transition"
                  >
                    {choice}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // ── COMPAT TEST SCREEN ──
  if (game === 'compat') {
    const q = COMPAT_QUESTIONS[compatIdx]
    const progress = (compatIdx + (compatTurn === 'you' ? 0.5 : 0)) / COMPAT_QUESTIONS.length
    return (
      <div className="px-4 pb-24">
        <BackBar title="💘 궁합 테스트" />
        {compatDone ? (
          <ResultScreen score={compatScore} matchCount={compatMatchCount} total={COMPAT_QUESTIONS.length} title="궁합 테스트" />
        ) : (
          <motion.div key={`${compatIdx}-${compatTurn}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                <span>{compatIdx + 1} / {COMPAT_QUESTIONS.length}</span>
                <span className="gradient-text">{compatTurn === 'me' ? (data.names.me || '나') : (data.names.you || '너')} 차례</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress * 100}%` }} className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" />
              </div>
            </div>

            <div className="glass-card p-8 text-center mb-6">
              <span className="text-4xl mb-4 block">{q.icon}</span>
              <div className="text-[16px] font-extrabold text-gray-800 mb-2 leading-relaxed">{q.q}</div>
              <div className="text-[12px] text-gray-400 mb-6">
                {compatTurn === 'me' ? (data.names.me || '나') : (data.names.you || '너')}, 어떻게 생각해?
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCompat(true)}
                  className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-[18px] font-extrabold text-green-600 hover:border-green-400 transition">
                  ⭕ 맞아
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCompat(false)}
                  className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 text-[18px] font-extrabold text-red-500 hover:border-red-400 transition">
                  ❌ 아니야
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // ── OX QUIZ SCREEN ──
  if (game === 'ox') {
    const q = OX_QUESTIONS[oxIdx]
    const progress = oxIdx / OX_QUESTIONS.length
    return (
      <div className="px-4 pb-24">
        <BackBar title="🧠 상대방 OX 퀴즈" />
        {oxDone ? (
          <ResultScreen score={oxScore} total={OX_QUESTIONS.length} title="OX 퀴즈" />
        ) : (
          <motion.div key={oxIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                <span>{oxIdx + 1} / {OX_QUESTIONS.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress * 100}%` }} className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
              </div>
            </div>

            <div className="glass-card p-8 text-center mb-6">
              <span className="text-4xl mb-4 block">{q.emoji}</span>
              <div className="text-[16px] font-extrabold text-gray-800 mb-6 leading-relaxed">{q.q}</div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleOx(true)}
                  className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 text-[20px] font-black text-blue-600 hover:border-blue-400 transition">
                  ⭕
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleOx(false)}
                  className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 text-[20px] font-black text-gray-500 hover:border-gray-400 transition">
                  ❌
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return null
}
