import { motion } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'

export default function CoupleStats() {
  const { data } = useFirebase()

  const myName = data.names?.me || '나'
  const yourName = data.names?.you || '너'

  // ── Chat stats ──
  const chatMessages = (data.chat || []).filter(Boolean)
  const totalChats = chatMessages.length
  const myChats = chatMessages.filter(m => m.from === myName).length
  const yourChats = chatMessages.filter(m => m.from === yourName).length

  // Chat by date (last 7 days)
  const today = new Date()
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  const chatByDay = last7.map(date => ({
    date,
    label: date.slice(8) + '일',
    count: chatMessages.filter(m => m.date === date).length,
  }))


  // ── Question stats ──
  const dailyQ = data.questions?.daily || {}
  const qDates = Object.keys(dailyQ).sort().reverse()
  const totalQDays = qDates.length
  const bothAnswered = qDates.filter(d => dailyQ[d]?.me && dailyQ[d]?.you).length

  let streak = 0
  for (let i = 0; i < qDates.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    if (qDates[i] === expected.toISOString().split('T')[0]) {
      const e = dailyQ[qDates[i]]
      if (e?.me || e?.you) streak++
      else break
    } else break
  }

  // ── Todo stats ──
  const todos = (data.todos || []).filter(Boolean)
  const todoDone = todos.filter(t => t.done).length
  const todoTotal = todos.length
  const todoPct = todoTotal > 0 ? Math.round((todoDone / todoTotal) * 100) : 0

  // ── Savings stats ──
  const savings = (data.savings || []).filter(Boolean)
  const totalSaved = savings.reduce((s, g) => s + (g?.current || 0), 0)
  const totalTarget = savings.reduce((s, g) => s + (g?.target || 0), 0)
  const savingsPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  // ── Album & Memory stats ──
  const albumCount = (data.album || []).filter(Boolean).length
  const memoryCount = (data.memories || []).filter(Boolean).length
  const spotCount = (data.spots || []).filter(Boolean).length
  const visitedSpots = (data.spots || []).filter(s => s?.visited).length

  // ── Game stats ──
  const games = (data.gameHistory || []).filter(Boolean)
  const avgScore = games.length > 0 ? Math.round(games.reduce((s, g) => s + (g.score || 0), 0) / games.length) : 0

  // ── D-day ──
  const diffDays = data.ddayDate
    ? Math.floor((Date.now() - new Date(data.ddayDate).getTime()) / 86400000) + 1
    : 0

  // ── Helper: mini bar chart ──
  const BarChart = ({ items, color }: { items: { label: string; count: number }[]; color: string }) => {
    const max = Math.max(...items.map(d => d.count), 1)
    return (
      <div className="flex items-end gap-1.5 h-20">
        {items.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, (item.count / max) * 100)}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={`w-full rounded-t-md ${color}`}
              style={{ minHeight: item.count > 0 ? 8 : 4 }}
            />
            <span className="text-[9px] text-gray-400 font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  // ── Helper: circular progress ──
  const CircleProgress = ({ pct, label, color }: { pct: number; label: string; color: string }) => {
    const r = 32
    const c = 2 * Math.PI * r
    const offset = c - (Math.min(pct, 100) / 100) * c
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r={r} fill="none"
              stroke={color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-gray-800">
            {pct}%
          </div>
        </div>
        <span className="text-[11px] font-bold text-gray-500">{label}</span>
      </div>
    )
  }

  const formatMoney = (n: number) => {
    if (n >= 10000) return `${Math.floor(n / 10000)}만원`
    return `${n.toLocaleString()}원`
  }

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-3"
      >
        <h2 className="text-lg font-black text-gray-800">📊 우리의 기록</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {diffDays > 0 ? `${diffDays}일 동안의 소중한 기록들` : '우리의 활동을 한눈에 확인해요'}
        </p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2 mb-4"
      >
        {[
          { emoji: '💬', value: totalChats, label: '채팅', color: 'from-pink-500 to-rose-500' },
          { emoji: '📸', value: albumCount, label: '사진', color: 'from-violet-500 to-purple-500' },
          { emoji: '📍', value: spotCount, label: '장소', color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="glass-card p-3 text-center"
          >
            <span className="text-xl">{s.emoji}</span>
            <div className="text-xl font-black gradient-text mt-1">{s.value}</div>
            <div className="text-[10px] font-bold text-gray-400">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chat Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 mb-3"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-800">💬 최근 7일 채팅</div>
          <div className="text-[11px] text-gray-400 font-semibold">
            총 {chatByDay.reduce((s, d) => s + d.count, 0)}건
          </div>
        </div>
        <BarChart items={chatByDay} color="bg-gradient-to-t from-primary to-secondary" />

        {totalChats > 0 && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100/50">
            <div className="flex-1 text-center">
              <div className="text-[13px] font-extrabold text-primary">{myChats}</div>
              <div className="text-[10px] text-gray-400 font-semibold">{myName}</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex-1 text-center">
              <div className="text-[13px] font-extrabold text-secondary">{yourChats}</div>
              <div className="text-[10px] text-gray-400 font-semibold">{yourName}</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex-1 text-center">
              <div className="text-[13px] font-extrabold text-gray-700">
                {totalChats > 0 ? Math.round((myChats / totalChats) * 100) : 0}:{totalChats > 0 ? Math.round((yourChats / totalChats) * 100) : 0}
              </div>
              <div className="text-[10px] text-gray-400 font-semibold">비율</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Progress Circles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-4 mb-3"
      >
        <div className="text-sm font-bold text-gray-800 mb-4">🎯 달성률</div>
        <div className="flex justify-around">
          <CircleProgress pct={todoPct} label="할일 완료" color="#EC4899" />
          <CircleProgress pct={savingsPct} label="저축 달성" color="#A78BFA" />
          <CircleProgress
            pct={totalQDays > 0 ? Math.round((bothAnswered / totalQDays) * 100) : 0}
            label="질문 함께"
            color="#F59E0B"
          />
        </div>
      </motion.div>

      {/* Question Streak */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 mb-3"
      >
        <div className="text-sm font-bold text-gray-800 mb-3">❓ 질문 & 답변</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-black gradient-text">{streak}</div>
            <div className="text-[10px] font-bold text-gray-400">🔥 연속 답변</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-gray-800">{totalQDays}</div>
            <div className="text-[10px] font-bold text-gray-400">답변한 날</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-secondary">{bothAnswered}</div>
            <div className="text-[10px] font-bold text-gray-400">둘 다 답변</div>
          </div>
        </div>
      </motion.div>

      {/* Savings Detail */}
      {savings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-4 mb-3"
        >
          <div className="text-sm font-bold text-gray-800 mb-3">💰 저축 현황</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-black gradient-text">{formatMoney(totalSaved)}</span>
            <span className="text-[12px] text-gray-400">/ {formatMoney(totalTarget)}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, savingsPct)}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          <div className="space-y-1.5">
            {savings.map((g, i) => {
              const pct = g.target > 0 ? Math.min(100, Math.round(((g.current || 0) / g.target) * 100)) : 0
              return (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span>{g.emoji || '💰'}</span>
                  <span className="font-bold text-gray-700 flex-1 truncate">{g.title}</span>
                  <span className={`font-extrabold ${pct >= 100 ? 'text-green-500' : 'text-primary'}`}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4 mb-3"
      >
        <div className="text-sm font-bold text-gray-800 mb-3">📋 활동 요약</div>
        <div className="space-y-2">
          {[
            { emoji: '📸', label: '추억 기록', value: `${memoryCount}개` },
            { emoji: '📍', label: '데이트 장소', value: `${visitedSpots}/${spotCount} 방문` },
            { emoji: '🎮', label: '게임 플레이', value: games.length > 0 ? `${games.length}회 (평균 ${avgScore}%)` : '아직 없음' },
            { emoji: '🎁', label: '위시리스트', value: `${(data.wishes || []).filter(w => w?.done).length}/${(data.wishes || []).filter(Boolean).length} 달성` },
            { emoji: '🎂', label: '등록된 생일', value: `${(data.birthdays || []).filter(Boolean).length}명` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="flex-1 text-[13px] font-semibold text-gray-600">{item.label}</span>
              <span className="text-[13px] font-extrabold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Love Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-5 text-center"
      >
        <div className="text-sm font-bold text-gray-800 mb-2">💕 우리의 러브 스코어</div>
        {(() => {
          const factors = [
            totalChats > 0 ? 20 : 0,
            streak >= 3 ? 15 : streak >= 1 ? 8 : 0,
            todoPct >= 50 ? 15 : todoPct > 0 ? 8 : 0,
            savingsPct >= 30 ? 15 : savingsPct > 0 ? 8 : 0,
            albumCount >= 5 ? 10 : albumCount > 0 ? 5 : 0,
            memoryCount >= 3 ? 10 : memoryCount > 0 ? 5 : 0,
            visitedSpots >= 3 ? 10 : visitedSpots > 0 ? 5 : 0,
            games.length >= 2 ? 5 : games.length > 0 ? 3 : 0,
          ]
          const score = Math.min(100, factors.reduce((a, b) => a + b, 0))
          const emoji = score >= 80 ? '🥰' : score >= 60 ? '💕' : score >= 40 ? '😊' : score >= 20 ? '🌱' : '💤'
          const msg = score >= 80 ? '완벽한 커플이에요!' :
                      score >= 60 ? '잘하고 있어요!' :
                      score >= 40 ? '점점 좋아지고 있어요' :
                      score >= 20 ? '시작이 반이에요!' :
                      '함께 채워나가요!'
          return (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-2"
              >{emoji}</motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="text-4xl font-black gradient-text mb-1"
              >{score}점</motion.div>
              <div className="text-[13px] font-bold text-gray-500">{msg}</div>
            </>
          )
        })()}
      </motion.div>
    </div>
  )
}
