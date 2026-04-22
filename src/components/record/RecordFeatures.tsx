import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2, X } from 'lucide-react'

// ===== MEMORIES =====
export function Memories() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', desc: '' })

  const memories = (data.memories || []).filter(Boolean)

  const save = () => {
    if (!form.title.trim()) return
    updateData(prev => ({
      ...prev,
      memories: [...(prev.memories || []), { ...form, date: form.date || new Date().toISOString().split('T')[0] }]
    }))
    setForm({ title: '', date: '', desc: '' })
    setModal(false)
  }

  const remove = (idx: number) => {
    updateData(prev => ({ ...prev, memories: (prev.memories || []).filter((_, i) => i !== idx) }))
  }

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-3"
      >
        <div>
          <h2 className="text-lg font-black text-gray-800">📸 소중한 추억</h2>
          <p className="text-xs text-gray-400 mt-0.5">우리의 특별한 순간들을 기록해요</p>
        </div>
        <motion.button
          onClick={() => setModal(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Stats */}
      {memories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
            📸
          </div>
          <div>
            <div className="text-xl font-black gradient-text">{memories.length}개의 추억</div>
            <div className="text-[11px] text-gray-400 font-semibold">소중한 순간들을 모아봐요</div>
          </div>
        </motion.div>
      )}

      {/* List */}
      {memories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">📸</motion.span>
          <h3 className="text-base font-extrabold text-gray-800 mb-1">아직 추억이 없어요</h3>
          <p className="text-sm text-gray-400">소중한 순간을 기록해보세요</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {[...memories].reverse().map((m, i) => {
              const realIdx = memories.length - 1 - i
              return (
                <motion.div
                  key={realIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <motion.div
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl shrink-0"
                      >
                        📸
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold text-gray-800">{m.title}</div>
                        {m.desc && <div className="text-[12px] text-gray-500 mt-0.5">{m.desc}</div>}
                        <div className="text-[11px] text-gray-400 mt-1">{m.date}</div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => remove(realIdx)}
                      whileTap={{ scale: 0.85 }}
                      className="p-2.5 -mr-1 text-gray-300 hover:text-red-400 transition shrink-0"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setModal(false)}
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
                <h3 className="text-base font-extrabold text-gray-800">📸 추억 기록</h3>
                <button onClick={() => setModal(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>

              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="제목 (예: 첫 여행) *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="어떤 순간이었나요? (선택)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80 resize-none"
                />
                <motion.button
                  onClick={save}
                  disabled={!form.title.trim()}
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

// ===== TIME CAPSULES =====
export function Timecapsules() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ message: '', openDate: '', from: 'me' })
  const today = new Date().toISOString().split('T')[0]

  const capsules = (data.timecapsules || []).filter(Boolean)

  const save = () => {
    if (!form.message.trim() || !form.openDate) return
    updateData(prev => ({
      ...prev,
      timecapsules: [...(prev.timecapsules || []), { ...form, createdAt: today, opened: false }]
    }))
    setForm({ message: '', openDate: '', from: 'me' })
    setModal(false)
  }

  const openCapsule = (idx: number) => {
    updateData(prev => ({
      ...prev,
      timecapsules: (prev.timecapsules || []).map((t, i) => i === idx ? { ...t, opened: true } : t)
    }))
  }

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-3"
      >
        <div>
          <h2 className="text-lg font-black text-gray-800">📬 타임캡슐</h2>
          <p className="text-xs text-gray-400 mt-0.5">미래의 우리에게 메시지를 남겨요</p>
        </div>
        <motion.button
          onClick={() => setModal(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* List */}
      {capsules.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">📬</motion.span>
          <h3 className="text-base font-extrabold text-gray-800 mb-1">타임캡슐을 묻어보세요</h3>
          <p className="text-sm text-gray-400">미래의 우리에게 메시지를 보내요</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {capsules.map((t, i) => {
              const canOpen = today >= t.openDate
              const daysLeft = Math.max(0, Math.ceil((new Date(t.openDate).getTime() - Date.now()) / 86400000))
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-4 overflow-hidden ${t.opened ? '' : canOpen ? 'ring-2 ring-primary/30' : ''}`}
                >
                  {t.opened ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl shrink-0">
                        💌
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] text-gray-700 leading-relaxed">{t.message}</div>
                        <div className="text-[11px] text-gray-400 mt-2 font-semibold">
                          작성 {t.createdAt} · 개봉 {t.openDate}
                        </div>
                      </div>
                    </div>
                  ) : canOpen ? (
                    <div className="text-center py-2">
                      <motion.span
                        animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl block mb-3"
                      >🎁</motion.span>
                      <div className="text-[14px] font-extrabold text-gray-800 mb-3">캡슐을 열 수 있어요!</div>
                      <motion.button
                        onClick={() => openCapsule(i)}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
                      >
                        열어보기
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100/80 flex items-center justify-center text-xl shrink-0">
                        🔒
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-bold text-gray-500">{t.openDate}에 열 수 있어요</div>
                        <div className="text-[11px] text-gray-400 mt-0.5 font-semibold">D-{daysLeft}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setModal(false)}
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
                <h3 className="text-base font-extrabold text-gray-800">📬 타임캡슐 만들기</h3>
                <button onClick={() => setModal(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>

              <div className="space-y-3">
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="미래의 우리에게 메시지를 남겨주세요... *"
                  rows={4}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80 resize-none"
                />
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">개봉일</label>
                  <input
                    type="date"
                    value={form.openDate}
                    onChange={e => setForm(f => ({ ...f, openDate: e.target.value }))}
                    min={today}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                  />
                </div>
                <motion.button
                  onClick={save}
                  disabled={!form.message.trim() || !form.openDate}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[15px] shadow-[0_8px_24px_rgba(236,72,153,0.25)] disabled:opacity-30"
                >
                  캡슐 묻기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
