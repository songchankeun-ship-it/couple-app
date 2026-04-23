import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2, X, Cake, Gift } from 'lucide-react'

// ===== BIRTHDAYS =====
export function Birthdays() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', date: '', relation: '' })

  const birthdays = (data.birthdays || []).filter(Boolean)

  const save = () => {
    if (!form.name.trim() || !form.date) return
    updateData(prev => ({ ...prev, birthdays: [...(prev.birthdays || []), { ...form }] }))
    setForm({ name: '', date: '', relation: '' })
    setModal(false)
  }

  const remove = (idx: number) => updateData(prev => ({ ...prev, birthdays: (prev.birthdays || []).filter((_, i) => i !== idx) }))

  const getDday = (dateStr: string) => {
    const [, m, d] = dateStr.split('-').map(Number)
    const today = new Date()
    let next = new Date(today.getFullYear(), m - 1, d)
    if (next < today) next = new Date(today.getFullYear() + 1, m - 1, d)
    return Math.ceil((next.getTime() - today.getTime()) / 86400000)
  }

  const sorted = [...birthdays].sort((a, b) => getDday(a.date) - getDday(b.date))

  return (
    <div className="px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-3"
      >
        <div>
          <h2 className="text-lg font-black text-gray-800">🎂 생일 관리</h2>
          <p className="text-xs text-gray-400 mt-0.5">소중한 사람들의 생일을 챙겨요</p>
        </div>
        <motion.button
          onClick={() => setModal(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_2px_8px_rgba(242,160,181,0.15)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {sorted.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">🎂</motion.span>
          <h3 className="text-base font-bold text-gray-800 mb-1">생일을 등록해보세요</h3>
          <p className="text-sm text-gray-400">소중한 사람들의 생일을 놓치지 마세요!</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sorted.map((b, i) => {
              const dd = getDday(b.date)
              const realIdx = birthdays.indexOf(b)
              return (
                <motion.div
                  key={realIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                    <Cake size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-gray-800 truncate">
                      {b.name} {b.relation && <span className="text-gray-400 font-normal text-[12px]">({b.relation})</span>}
                    </div>
                    <div className="text-[11px] text-gray-400 font-semibold">{b.date.split('-').slice(1).join('월 ')}일</div>
                  </div>
                  <div className={`text-[13px] font-bold shrink-0 ${dd === 0 ? 'gradient-text' : 'text-primary'}`}>
                    {dd === 0 ? '🎉 오늘!' : `D-${dd}`}
                  </div>
                  <motion.button
                    onClick={() => remove(realIdx)}
                    whileTap={{ scale: 0.85 }}
                    className="p-2.5 -mr-1 text-gray-300 hover:text-red-400 transition shrink-0"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white backdrop-blur-sm rounded-t-3xl w-full max-w-[480px] p-5 pb-10 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">🎂 생일 등록</h3>
                <button onClick={() => setModal(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-3">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="이름 *" autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />
                <input value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}
                  placeholder="관계 (예: 엄마, 친구)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />
                <motion.button onClick={save} disabled={!form.name.trim() || !form.date} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-[15px] shadow-[0_2px_8px_rgba(242,160,181,0.2)] disabled:opacity-30">
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

// ===== WISHLIST =====
export function Wishlist() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', price: '', link: '' })

  const wishes = (data.wishes || []).filter(Boolean)

  const save = () => {
    if (!form.title.trim()) return
    updateData(prev => ({ ...prev, wishes: [...(prev.wishes || []), { ...form, done: false }] }))
    setForm({ title: '', price: '', link: '' })
    setModal(false)
  }

  const toggle = (idx: number) => updateData(prev => ({ ...prev, wishes: (prev.wishes || []).map((w, i) => i === idx ? { ...w, done: !w.done } : w) }))
  const remove = (idx: number) => updateData(prev => ({ ...prev, wishes: (prev.wishes || []).filter((_, i) => i !== idx) }))

  const doneCount = wishes.filter(w => w?.done).length

  return (
    <div className="px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-3"
      >
        <div>
          <h2 className="text-lg font-black text-gray-800">🎁 위시리스트</h2>
          <p className="text-xs text-gray-400 mt-0.5">갖고 싶은 것들을 모아봐요</p>
        </div>
        <motion.button
          onClick={() => setModal(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_2px_8px_rgba(242,160,181,0.15)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Progress */}
      {wishes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
            🎁
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-gray-400 font-semibold">위시 달성</div>
            <div className="text-xl font-black gradient-text">{doneCount}/{wishes.length}</div>
          </div>
        </motion.div>
      )}

      {wishes.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">🎁</motion.span>
          <h3 className="text-base font-bold text-gray-800 mb-1">위시리스트가 비어있어요</h3>
          <p className="text-sm text-gray-400">갖고 싶은 것을 추가해보세요!</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {/* Undone first, then done */}
          {[...wishes.filter(w => !w.done), ...wishes.filter(w => w.done)].map((w, _i) => {
            const realIdx = wishes.indexOf(w)
            return (
              <motion.div
                key={realIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: _i * 0.03 }}
                onClick={() => toggle(realIdx)}
                className={`glass-card p-4 flex items-center gap-3 cursor-pointer ${w.done ? 'opacity-50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${w.done ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-gray-100/80'}`}>
                  <Gift size={20} className={w.done ? 'text-primary' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[14px] font-bold ${w.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{w.title}</div>
                  {w.price && <div className="text-[11px] text-gray-400">{w.price}</div>}
                </div>
                {w.done && (
                  <span className="text-[10px] bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/10">
                    ✓ 완료
                  </span>
                )}
                <motion.button
                  onClick={e => { e.stopPropagation(); remove(realIdx) }}
                  whileTap={{ scale: 0.85 }}
                  className="p-2.5 -mr-1 text-gray-300 hover:text-red-400 transition shrink-0"
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white backdrop-blur-sm rounded-t-3xl w-full max-w-[480px] p-5 pb-10 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">🎁 위시 추가</h3>
                <button onClick={() => setModal(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-3">
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="갖고 싶은 것 *" autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />
                <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="가격 (선택)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />
                <motion.button onClick={save} disabled={!form.title.trim()} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-[15px] shadow-[0_2px_8px_rgba(242,160,181,0.2)] disabled:opacity-30">
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
