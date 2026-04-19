import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, X } from 'lucide-react'

interface TimelineEvent {
  date: string
  title: string
  emoji: string
  type: 'auto' | 'manual'
  detail?: string
  photoSrc?: string
}

export default function Timeline() {
  const { data, updateData } = useFirebase()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', emoji: '💕', detail: '' })

  // Build timeline events from existing data
  const events: TimelineEvent[] = []

  // D-day
  if (data.ddayDate) {
    events.push({ date: data.ddayDate, title: '우리의 시작 💕', emoji: '💑', type: 'auto', detail: '처음 사귀기 시작한 날' })
  }

  // First chat
  if (data.chat.length > 0) {
    const firstChat = data.chat[0]
    events.push({ date: firstChat.date, title: '첫 메시지', emoji: '💬', type: 'auto', detail: `"${firstChat.text.slice(0, 30)}${firstChat.text.length > 30 ? '...' : ''}"` })
  }

  // First photo
  if (data.album.length > 0 && data.album[0].date) {
    events.push({ date: data.album[0].date, title: '첫 사진', emoji: '📸', type: 'auto', photoSrc: data.album[0].src })
  }

  // Calendar events / anniversaries
  data.events?.forEach(ev => {
    events.push({ date: ev.date, title: ev.title, emoji: '📅', type: 'auto' })
  })

  // Milestones from D-day
  if (data.ddayDate) {
    const start = new Date(data.ddayDate).getTime()
    const now = Date.now()
    const milestones = [
      { days: 100, title: '100일 기념', emoji: '🎂' },
      { days: 200, title: '200일 기념', emoji: '🎉' },
      { days: 300, title: '300일 기념', emoji: '🌟' },
      { days: 365, title: '1주년', emoji: '👑' },
      { days: 500, title: '500일 기념', emoji: '💎' },
      { days: 730, title: '2주년', emoji: '🏆' },
      { days: 1000, title: '1000일 기념', emoji: '🌈' },
      { days: 1095, title: '3주년', emoji: '💐' },
    ]
    milestones.forEach(m => {
      const mDate = new Date(start + m.days * 86400000)
      const mDateStr = mDate.toISOString().split('T')[0]
      const isPast = mDate.getTime() <= now
      if (isPast) {
        events.push({ date: mDateStr, title: m.title, emoji: m.emoji, type: 'auto', detail: `D+${m.days}` })
      } else {
        // Show upcoming ones too with a different style
        events.push({ date: mDateStr, title: `${m.title} (예정)`, emoji: m.emoji, type: 'auto', detail: `D+${m.days}` })
      }
    })
  }

  // Custom timeline entries from data
  const customEntries: TimelineEvent[] = (data as any).timelineEntries || []
  events.push(...customEntries.map(e => ({ ...e, type: 'manual' as const })))

  // Sort by date descending (newest first)
  events.sort((a, b) => b.date.localeCompare(a.date))

  // Group by year-month
  const grouped: Record<string, TimelineEvent[]> = {}
  events.forEach(ev => {
    const ym = ev.date.slice(0, 7) // YYYY-MM
    if (!grouped[ym]) grouped[ym] = []
    grouped[ym].push(ev)
  })

  const addEntry = () => {
    if (!form.title.trim() || !form.date) return
    updateData(prev => ({
      ...prev,
      timelineEntries: [...((prev as any).timelineEntries || []), {
        title: form.title.trim(),
        date: form.date,
        emoji: form.emoji || '💕',
        detail: form.detail || '',
        type: 'manual',
      }]
    } as any))
    setForm({ title: '', date: '', emoji: '💕', detail: '' })
    setShowAdd(false)
  }

  const formatMonth = (ym: string) => {
    const [y, m] = ym.split('-')
    return `${y}년 ${parseInt(m)}월`
  }

  const isUpcoming = (dateStr: string) => new Date(dateStr).getTime() > Date.now()

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-3"
      >
        <div>
          <h2 className="text-lg font-black text-gray-800">📜 우리의 타임라인</h2>
          <p className="text-xs text-gray-400 mt-0.5">함께 걸어온 길을 되돌아봐요</p>
        </div>
        <motion.button
          onClick={() => setShowAdd(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Timeline count */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-5 flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
          📜
        </div>
        <div>
          <div className="text-xl font-black gradient-text">{events.length}개의 순간</div>
          <div className="text-[11px] text-gray-400 font-semibold">
            {data.ddayDate ? `${data.ddayDate}부터 지금까지` : '우리의 이야기'}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">📜</motion.span>
          <h3 className="text-base font-extrabold text-gray-800 mb-1">아직 타임라인이 비어있어요</h3>
          <p className="text-sm text-gray-400">사귄 날짜를 설정하거나 추억을 추가해보세요!</p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 via-secondary/20 to-transparent" />

          {Object.entries(grouped).map(([ym, evts], gi) => (
            <div key={ym} className="mb-6">
              {/* Month label */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: gi * 0.08 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-black shadow-[0_4px_12px_rgba(236,72,153,0.25)] z-10">
                  {parseInt(ym.split('-')[1])}월
                </div>
                <span className="text-[13px] font-extrabold text-gray-600">{formatMonth(ym)}</span>
              </motion.div>

              {/* Events in this month */}
              <div className="space-y-3 ml-[19px] pl-6 border-l-0">
                {evts.map((ev, i) => (
                  <motion.div
                    key={`${ym}-${i}`}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.08 + i * 0.05 }}
                    className="relative"
                  >
                    {/* Dot on timeline */}
                    <div className={`absolute -left-[27px] top-3 w-3 h-3 rounded-full border-2 border-white z-10 shadow-sm
                      ${isUpcoming(ev.date) ? 'bg-secondary/50' : ev.type === 'manual' ? 'bg-primary' : 'bg-gradient-to-br from-primary to-secondary'}`}
                    />

                    <div className={`glass-card p-4 ${isUpcoming(ev.date) ? 'opacity-60 border-dashed' : ''}`}>
                      <div className="flex items-start gap-3">
                        <motion.span
                          animate={!isUpcoming(ev.date) ? { rotate: [0, -5, 5, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          className="text-2xl mt-0.5"
                        >
                          {ev.emoji}
                        </motion.span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[14px] font-bold text-gray-800">{ev.title}</span>
                            {isUpcoming(ev.date) && (
                              <span className="text-[9px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full font-bold">예정</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-semibold">{ev.date}</div>
                          {ev.detail && <div className="text-[12px] text-gray-500 mt-1">{ev.detail}</div>}
                          {ev.photoSrc && (
                            <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden shadow-sm">
                              <img src={ev.photoSrc} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl rounded-t-3xl w-full max-w-[480px] p-5 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-gray-800">📜 추억 추가</h3>
                <button onClick={() => setShowAdd(false)} className="p-1 text-gray-400"><X size={20} /></button>
              </div>

              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="무슨 일이 있었나요? *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />

                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />

                {/* Emoji picker */}
                <div className="flex gap-2 flex-wrap">
                  {['💕', '🎂', '✈️', '🎉', '📸', '🏠', '💍', '🎁', '🌸', '⭐'].map(e => (
                    <button
                      key={e}
                      onClick={() => setForm(f => ({ ...f, emoji: e }))}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition
                        ${form.emoji === e ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 scale-110' : 'bg-gray-50 border border-gray-100'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>

                <input
                  value={form.detail}
                  onChange={e => setForm(f => ({ ...f, detail: e.target.value }))}
                  placeholder="세부 내용 (선택)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />

                <motion.button
                  onClick={addEntry}
                  disabled={!form.title.trim() || !form.date}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[15px] shadow-[0_8px_24px_rgba(236,72,153,0.25)] disabled:opacity-30"
                >
                  추가하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
