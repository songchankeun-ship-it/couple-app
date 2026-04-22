import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react'
import type { CalendarEvent } from '../../types/data'

const EVENT_COLORS = ['#EC4899', '#A78BFA', '#F472B6', '#818CF8', '#FBBF24', '#34D399']

export default function CalendarView() {
  const { data, updateData } = useFirebase()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [modal, setModal] = useState<{ type: 'add' | 'edit'; event?: CalendarEvent; index?: number; date?: string } | null>(null)
  const [form, setForm] = useState({ title: '', date: '', note: '', color: EVENT_COLORS[0] })

  const events = (data.events || []).filter(Boolean)

  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const prevLastDate = new Date(year, month, 0).getDate()

  const eventDates = new Set(events.map(e => e.date))

  const changeMonth = (dir: number) => {
    let m = month + dir, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setMonth(m); setYear(y)
  }

  const dayStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const openAdd = (date?: string) => {
    const d = date || today.toISOString().split('T')[0]
    setForm({ title: '', date: d, note: '', color: EVENT_COLORS[0] })
    setModal({ type: 'add', date: d })
  }

  const openEdit = (idx: number) => {
    const ev = events[idx]
    if (!ev) return
    setForm({ title: ev.title, date: ev.date, note: ev.note || '', color: ev.color || EVENT_COLORS[0] })
    setModal({ type: 'edit', index: idx, event: ev })
  }

  const save = () => {
    if (!form.title || !form.date) return
    updateData(prev => {
      const evts = [...(prev.events || [])]
      if (modal?.type === 'edit' && modal.index !== undefined) {
        evts[modal.index] = { ...form }
      } else {
        evts.push({ ...form })
      }
      return { ...prev, events: evts }
    })
    setModal(null)
  }

  const remove = (idx: number) => {
    updateData(prev => ({
      ...prev,
      events: (prev.events || []).filter((_, i) => i !== idx)
    }))
    setModal(null)
  }

  const monthEvents = events
    .filter(e => e.date?.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .sort((a, b) => a.date.localeCompare(b.date))

  const days: { day: number; current: boolean; isToday: boolean; hasEvent: boolean; dateStr: string }[] = []
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevLastDate - i, current: false, isToday: false, hasEvent: false, dateStr: '' })
  for (let d = 1; d <= lastDate; d++) {
    const ds = dayStr(d)
    days.push({
      day: d, current: true,
      isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      hasEvent: eventDates.has(ds),
      dateStr: ds,
    })
  }
  const rem = (7 - days.length % 7) % 7
  for (let i = 1; i <= rem; i++) days.push({ day: i, current: false, isToday: false, hasEvent: false, dateStr: '' })

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-3"
      >
        <div>
          <h2 className="text-lg font-black text-gray-800">📅 캘린더</h2>
          <p className="text-xs text-gray-400 mt-0.5">우리의 일정을 함께 관리해요</p>
        </div>
        <motion.button
          onClick={() => openAdd()}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => changeMonth(-1)}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </motion.button>
          <h2 className="text-[15px] font-extrabold text-gray-800">{year}년 {month + 1}월</h2>
          <motion.button
            onClick={() => changeMonth(1)}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"
          >
            <ChevronRight size={18} className="text-gray-500" />
          </motion.button>
        </div>
        <div className="grid grid-cols-7 gap-0">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={`text-center text-[11px] font-bold py-1.5 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>{d}</div>
          ))}
          {days.map((d, i) => (
            <button key={i}
              onClick={() => d.current && openAdd(d.dateStr)}
              className={`aspect-square flex flex-col items-center justify-center text-[13px] font-medium rounded-lg relative transition-all
                ${!d.current ? 'text-gray-300' : ''}
                ${d.isToday ? 'bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-full shadow-[0_3px_12px_rgba(236,72,153,0.3)]' : ''}
                ${d.current && !d.isToday && i % 7 === 0 ? 'text-red-400' : ''}
                ${d.current && !d.isToday && i % 7 === 6 ? 'text-blue-400' : ''}
                ${d.current && !d.isToday ? 'hover:bg-primary/5 active:scale-95' : ''}
              `}
            >
              {d.day}
              {d.hasEvent && (
                <span className={`absolute bottom-1 w-[5px] h-[5px] rounded-full ${d.isToday ? 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.5)]' : 'bg-primary shadow-[0_0_4px_rgba(236,72,153,0.4)]'}`} />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Event list */}
      {monthEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[14px] font-extrabold text-gray-800 mb-3 px-1">📋 이번 달 일정</h3>
          <div className="space-y-2">
            {monthEvents.map((ev, idx) => {
              const realIdx = events.indexOf(ev)
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => openEdit(realIdx)}
                  className="glass-card p-4 flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: ev.color || EVENT_COLORS[0] }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-gray-800 truncate">{ev.title}</div>
                    <div className="text-[11px] text-gray-400">{ev.date}{ev.note ? ` · ${ev.note}` : ''}</div>
                  </div>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); remove(realIdx) }}
                    whileTap={{ scale: 0.85 }}
                    className="p-2.5 -mr-1 text-gray-300 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl rounded-t-3xl w-full max-w-[480px] p-5 pb-10 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-gray-800">
                  {modal.type === 'edit' ? '✏️ 일정 수정' : '📅 일정 추가'}
                </h3>
                <button onClick={() => setModal(null)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>

              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="일정 이름 *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <input
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="메모 (선택)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">색상</label>
                  <div className="flex gap-2">
                    {EVENT_COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                        className={`w-9 h-9 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <motion.button
                  onClick={save}
                  disabled={!form.title.trim() || !form.date}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[15px] shadow-[0_8px_24px_rgba(236,72,153,0.25)] disabled:opacity-30"
                >
                  저장하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
