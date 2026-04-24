import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, X, Check, Star, Calendar } from 'lucide-react'
import { EmptyState } from '../shared/CoupleCharacter'

export default function CoupleTodo() {
  const { data, updateData } = useFirebase()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', assignee: '', dueDate: '', priority: false })
  const [filter, setFilter] = useState<'all' | 'mine' | 'yours'>('all')

  const todos = (data.todos || []).filter(Boolean)
  const myName = data.names?.me || '나'
  const yourName = data.names?.you || '상대'

  const filtered = todos.filter(t => {
    if (!t) return false
    if (filter === 'mine') return t.assignee === myName
    if (filter === 'yours') return t.assignee === yourName
    return true
  })

  const doneCount = todos.filter(t => t?.done).length
  const totalCount = todos.length
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const todayStr = new Date().toISOString().split('T')[0]

  const addTodo = () => {
    if (!form.title.trim()) return
    updateData(prev => ({
      ...prev,
      todos: [...(prev.todos || []), {
        title: form.title.trim(),
        assignee: form.assignee || undefined,
        dueDate: form.dueDate || undefined,
        category: form.priority ? 'important' : undefined,
        done: false,
      }]
    }))
    setForm({ title: '', assignee: '', dueDate: '', priority: false })
    setShowAdd(false)
  }

  const togglePriority = (idx: number) => {
    updateData(prev => ({
      ...prev,
      todos: (prev.todos || []).map((t, i) =>
        i === idx ? { ...t, category: t.category === 'important' ? undefined : 'important' } : t
      )
    }))
  }

  const toggleTodo = (idx: number) => {
    updateData(prev => ({
      ...prev,
      todos: (prev.todos || []).map((t, i) => i === idx ? { ...t, done: !t.done } : t)
    }))
  }

  const removeTodo = (idx: number) => {
    updateData(prev => ({
      ...prev,
      todos: (prev.todos || []).filter((_, i) => i !== idx)
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
          <h2 className="text-lg font-black text-gray-800">✅ 함께 할 일</h2>
          <p className="text-xs text-gray-400 mt-0.5">우리의 할 일을 같이 관리해요</p>
        </div>
        <motion.button
          onClick={() => setShowAdd(true)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_2px_8px_rgba(242,160,181,0.15)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Progress */}
      {totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">진행률</span>
            <span className="text-sm font-bold gradient-text">{doneCount}/{totalCount}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          <div className="text-[11px] text-gray-400 mt-1 text-right font-semibold">{progress}% 완료</div>
        </motion.div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all' as const, label: '전체' },
          { key: 'mine' as const, label: `${myName}` },
          { key: 'yours' as const, label: `${yourName}` },
        ].map(f => (
          <motion.button
            key={f.key}
            onClick={() => setFilter(f.key)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
              ${filter === f.key
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_2px_8px_rgba(242,160,181,0.15)]'
                : 'glass-card-solid text-gray-500'}`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Todo List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <EmptyState pose="think" title={totalCount === 0 ? '아직 할 일이 없어요' : '해당하는 할 일이 없어요'} subtitle="함께 할 일을 추가해보세요" size={50} />
        </motion.div>
      ) : (
        <div className="space-y-2">
          {/* Undone (priority first, overdue next) then done */}
          {[
            ...filtered.filter(t => !t.done).sort((a, b) => {
              if ((a.category === 'important') !== (b.category === 'important')) return a.category === 'important' ? -1 : 1
              if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
              if (a.dueDate) return -1
              if (b.dueDate) return 1
              return 0
            }),
            ...filtered.filter(t => t.done),
          ].map((todo, _i) => {
            const realIdx = todos.indexOf(todo)
            const isOverdue = !todo.done && todo.dueDate && todo.dueDate < todayStr
            const isDueToday = !todo.done && todo.dueDate === todayStr
            const isPriority = todo.category === 'important'
            return (
              <motion.div
                key={realIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: _i * 0.03 }}
                className={`glass-card p-4 flex items-center gap-3
                  ${todo.done ? 'opacity-50' : ''}
                  ${isOverdue ? 'ring-1 ring-red-200' : ''}
                  ${isDueToday ? 'ring-1 ring-primary/20' : ''}`}
              >
                {/* Checkbox */}
                <motion.button
                  onClick={() => toggleTodo(realIdx)}
                  whileTap={{ scale: 0.85 }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                    ${todo.done
                      ? 'bg-gradient-to-br from-primary to-secondary text-white'
                      : 'border-2 border-gray-200 text-transparent hover:border-primary/50'}`}
                >
                  <Check size={16} strokeWidth={3} />
                </motion.button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[14px] font-bold ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {todo.title}
                    </span>
                    {todo.assignee && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                        ${todo.assignee === myName ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {todo.assignee}
                      </span>
                    )}
                  </div>
                  {todo.dueDate && !todo.done && (
                    <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold
                      ${isOverdue ? 'text-red-500' : isDueToday ? 'text-primary' : 'text-gray-400'}`}>
                      <Calendar size={11} />
                      {isOverdue ? `마감 지남 (${todo.dueDate.slice(5).replace('-', '/')})` :
                       isDueToday ? '오늘 마감!' :
                       todo.dueDate.slice(5).replace('-', '/')}
                    </div>
                  )}
                </div>

                {/* Priority star */}
                <motion.button
                  onClick={() => togglePriority(realIdx)}
                  whileTap={{ scale: 0.85 }}
                  className="p-1.5 shrink-0"
                >
                  <Star size={16} className={`transition ${isPriority ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                </motion.button>

                {/* Delete */}
                <motion.button
                  onClick={() => removeTodo(realIdx)}
                  whileTap={{ scale: 0.85 }}
                  className="p-2.5 -mr-1 text-gray-300 hover:text-red-400 transition"
                >
                  <X size={18} />
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white backdrop-blur-sm rounded-t-3xl w-full max-w-[480px] p-5 pb-10 border-t border-white/50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800">✅ 할 일 추가</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>

              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="무엇을 해야 하나요? *"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                />

                {/* Due Date */}
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">마감일 (선택)</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80"
                  />
                </div>

                {/* Priority */}
                <motion.button
                  onClick={() => setForm(f => ({ ...f, priority: !f.priority }))}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${form.priority
                      ? 'bg-amber-50 border-2 border-amber-300 text-amber-700'
                      : 'bg-gray-50 border-2 border-gray-100 text-gray-500'}`}
                >
                  <Star size={16} className={form.priority ? 'fill-amber-400 text-amber-400' : ''} />
                  {form.priority ? '중요 표시됨' : '중요 표시'}
                </motion.button>

                {/* Assignee */}
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">담당자</label>
                  <div className="flex gap-2">
                    {[
                      { value: '', label: '미지정' },
                      { value: myName, label: myName },
                      { value: yourName, label: yourName },
                    ].map(opt => (
                      <motion.button
                        key={opt.value}
                        onClick={() => setForm(f => ({ ...f, assignee: opt.value }))}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all
                          ${form.assignee === opt.value
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_2px_8px_rgba(242,160,181,0.15)]'
                            : 'bg-gray-50 border border-gray-100 text-gray-500'}`}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={addTodo}
                  disabled={!form.title.trim()}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-[15px] shadow-[0_2px_8px_rgba(242,160,181,0.2)] disabled:opacity-30"
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
