import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, X, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

const GOAL_EMOJIS = ['🏠', '✈️', '💍', '🎁', '🚗', '📱', '🎓', '💰', '🐱', '🍽️']

export default function CoupleSavings() {
  const { data, updateData } = useFirebase()
  const [showAdd, setShowAdd] = useState(false)
  const [showDeposit, setShowDeposit] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', target: '', emoji: '💰' })
  const [depositForm, setDepositForm] = useState({ amount: '', from: '', note: '' })
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ title: '', target: '', emoji: '💰' })

  const savings = (data.savings || []).filter(Boolean)
  const myName = data.names?.me || '나'
  const yourName = data.names?.you || '상대'

  const totalSaved = savings.reduce((s, g) => s + (g?.current || 0), 0)
  const totalTarget = savings.reduce((s, g) => s + (g?.target || 0), 0)

  const addGoal = () => {
    if (!form.title.trim() || !form.target) return
    updateData(prev => ({
      ...prev,
      savings: [...(prev.savings || []), {
        title: form.title.trim(),
        target: parseInt(form.target),
        current: 0,
        date: new Date().toISOString().split('T')[0],
        emoji: form.emoji,
        deposits: [],
      }]
    }))
    setForm({ title: '', target: '', emoji: '💰' })
    setShowAdd(false)
  }

  const addDeposit = (goalIdx: number) => {
    if (!depositForm.amount) return
    const amount = parseInt(depositForm.amount)
    if (isNaN(amount) || amount <= 0) return

    updateData(prev => ({
      ...prev,
      savings: (prev.savings || []).map((g, i) => {
        if (i !== goalIdx) return g
        const newDeposit = {
          amount,
          from: depositForm.from || myName,
          date: new Date().toISOString().split('T')[0],
          note: depositForm.note || undefined,
        }
        return {
          ...g,
          current: (g.current || 0) + amount,
          deposits: [...(g.deposits || []), newDeposit],
        }
      })
    }))
    setDepositForm({ amount: '', from: '', note: '' })
    setShowDeposit(null)
  }

  const openEdit = (idx: number) => {
    const g = savings[idx]
    if (!g) return
    setEditForm({ title: g.title, target: String(g.target), emoji: g.emoji || '💰' })
    setEditIdx(idx)
  }

  const saveEdit = () => {
    if (editIdx === null || !editForm.title.trim() || !editForm.target) return
    updateData(prev => ({
      ...prev,
      savings: (prev.savings || []).map((g, i) =>
        i === editIdx ? { ...g, title: editForm.title.trim(), target: parseInt(editForm.target), emoji: editForm.emoji } : g
      )
    }))
    setEditIdx(null)
  }

  const removeGoal = (idx: number) => {
    updateData(prev => ({
      ...prev,
      savings: (prev.savings || []).filter((_, i) => i !== idx)
    }))
    setExpandedIdx(null)
  }

  const formatMoney = (n: number) => {
    if (n >= 10000) return `${Math.floor(n / 10000)}만${n % 10000 > 0 ? ` ${(n % 10000).toLocaleString()}` : ''}원`
    return `${n.toLocaleString()}원`
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
          <h2 className="text-lg font-black text-gray-800">💰 함께 모으기</h2>
          <p className="text-xs text-gray-400 mt-0.5">우리의 저축 목표를 관리해요</p>
        </div>
        <motion.button
          onClick={() => setShowAdd(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Total Summary */}
      {savings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-semibold">전체 저축 현황</div>
              <div className="text-xl font-black gradient-text">{formatMoney(totalSaved)}</div>
            </div>
          </div>
          {totalTarget > 0 && (
            <>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round((totalSaved / totalTarget) * 100))}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-gray-400 font-semibold">
                  {Math.round((totalSaved / totalTarget) * 100)}% 달성
                </span>
                <span className="text-[11px] text-gray-400 font-semibold">
                  목표 {formatMoney(totalTarget)}
                </span>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Goals List */}
      {savings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-4">💰</motion.span>
          <h3 className="text-base font-extrabold text-gray-800 mb-1">아직 저축 목표가 없어요</h3>
          <p className="text-sm text-gray-400">함께 모을 목표를 세워보세요!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {savings.map((goal, idx) => {
            const pct = goal.target > 0 ? Math.min(100, Math.round(((goal.current || 0) / goal.target) * 100)) : 0
            const isExpanded = expandedIdx === idx
            const deposits = goal.deposits || []
            const isComplete = pct >= 100

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card overflow-hidden ${isComplete ? 'ring-2 ring-primary/30' : ''}`}
              >
                {/* Goal Header */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <motion.span
                      animate={isComplete ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl mt-0.5"
                    >
                      {goal.emoji || '💰'}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-gray-800">{goal.title}</span>
                        {isComplete && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">달성!</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-[13px] font-extrabold gradient-text">{formatMoney(goal.current || 0)}</span>
                        <span className="text-[11px] text-gray-400">/ {formatMoney(goal.target)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-primary to-secondary'}`}
                    />
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 text-right font-semibold">{pct}%</div>

                  {/* Contributor stats */}
                  {deposits.length > 0 && (() => {
                    const byPerson: Record<string, number> = {}
                    deposits.forEach(d => { byPerson[d.from || '?'] = (byPerson[d.from || '?'] || 0) + d.amount })
                    const total = Object.values(byPerson).reduce((a, b) => a + b, 0)
                    return (
                      <div className="flex gap-2 mt-2">
                        {Object.entries(byPerson).map(([name, amt]) => (
                          <span key={name} className={`text-[10px] font-bold px-2 py-1 rounded-full
                            ${name === myName ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                            {name} {Math.round((amt / total) * 100)}%
                          </span>
                        ))}
                      </div>
                    )
                  })()}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      onClick={() => setShowDeposit(idx)}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-[13px] font-bold"
                    >
                      + 입금하기
                    </motion.button>
                    <motion.button
                      onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-400 text-[13px] font-bold flex items-center gap-1"
                    >
                      기록 {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </motion.button>
                    <motion.button
                      onClick={() => openEdit(idx)}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2.5 rounded-xl bg-gray-50 text-gray-400"
                    >
                      <Pencil size={14} />
                    </motion.button>
                    <motion.button
                      onClick={() => removeGoal(idx)}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2.5 rounded-xl bg-gray-50 text-gray-300"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Deposit History */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100 overflow-hidden"
                    >
                      <div className="p-4 pt-3 space-y-2">
                        {deposits.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-2">아직 입금 기록이 없어요</p>
                        ) : (
                          [...deposits].reverse().map((d, di) => (
                            <div key={di} className="flex items-center gap-2 text-xs">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                                ${d.from === myName ? 'bg-primary' : 'bg-secondary'}`}>
                                {d.from?.charAt(0) || '?'}
                              </span>
                              <span className="font-bold text-gray-700 flex-1">
                                +{formatMoney(d.amount)}
                              </span>
                              {d.note && <span className="text-gray-400 truncate max-w-[80px]">{d.note}</span>}
                              <span className="text-gray-300 text-[10px]">{d.date}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add Goal Modal */}
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
              className="bg-white/95 backdrop-blur-xl rounded-t-3xl w-full max-w-[480px] p-5 pb-10 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-gray-800">💰 새 저축 목표</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="무엇을 위해 모으나요? *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <input
                  type="number"
                  value={form.target}
                  onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  placeholder="목표 금액 (원) *"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <div className="flex gap-2 flex-wrap">
                  {GOAL_EMOJIS.map(e => (
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
                <motion.button
                  onClick={addGoal}
                  disabled={!form.title.trim() || !form.target}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[15px] shadow-[0_8px_24px_rgba(236,72,153,0.25)] disabled:opacity-30"
                >
                  목표 추가
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {editIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setEditIdx(null)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl rounded-t-3xl w-full max-w-[480px] p-5 pb-10 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-gray-800">✏️ 목표 수정</h3>
                <button onClick={() => setEditIdx(null)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="목표 이름 *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <input
                  type="number"
                  value={editForm.target}
                  onChange={e => setEditForm(f => ({ ...f, target: e.target.value }))}
                  placeholder="목표 금액 (원) *"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <div className="flex gap-2 flex-wrap">
                  {GOAL_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => setEditForm(f => ({ ...f, emoji: e }))}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition
                        ${editForm.emoji === e ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 scale-110' : 'bg-gray-50 border border-gray-100'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <motion.button
                  onClick={saveEdit}
                  disabled={!editForm.title.trim() || !editForm.target}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[15px] shadow-[0_8px_24px_rgba(236,72,153,0.25)] disabled:opacity-30"
                >
                  수정 완료
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDeposit !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowDeposit(null)}
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
                  💵 {savings[showDeposit]?.title}에 입금
                </h3>
                <button onClick={() => setShowDeposit(null)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-3">
                <input
                  type="number"
                  value={depositForm.amount}
                  onChange={e => setDepositForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="입금 금액 (원) *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">누가 입금하나요?</label>
                  <div className="flex gap-2">
                    {[myName, yourName].map(name => (
                      <motion.button
                        key={name}
                        onClick={() => setDepositForm(f => ({ ...f, from: name }))}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all
                          ${(depositForm.from || myName) === name
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_4px_12px_rgba(236,72,153,0.2)]'
                            : 'bg-gray-50 border border-gray-100 text-gray-500'}`}
                      >
                        {name}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <input
                  value={depositForm.note}
                  onChange={e => setDepositForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="메모 (선택)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />
                <motion.button
                  onClick={() => addDeposit(showDeposit)}
                  disabled={!depositForm.amount}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[15px] shadow-[0_8px_24px_rgba(236,72,153,0.25)] disabled:opacity-30"
                >
                  입금하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
