import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Star, Trash2, X } from 'lucide-react'
import type { SpotItem } from '../../types/data'

const SPOT_CATEGORIES = ['전체', '맛집', '카페', '술집', '여행', '데이트', '기타'] as const
const SPOT_EMOJIS: Record<string, string> = {
  '맛집': '🍽️', '카페': '☕', '술집': '🍷', '여행': '✈️', '데이트': '💑', '기타': '📍'
}

export default function DateMap() {
  const { data, updateData } = useFirebase()
  const spots = data.spots || []
  const [selectedCat, setSelectedCat] = useState<string>('전체')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState<Partial<SpotItem>>({ category: '맛집', rating: 0 })

  const filtered = selectedCat === '전체'
    ? spots
    : spots.filter(s => s.category === selectedCat)

  const visitedCount = spots.filter(s => s.visited).length
  const totalCount = spots.length

  const addSpot = () => {
    if (!form.name?.trim()) return
    const todayStr = new Date().toISOString().split('T')[0]
    updateData(prev => ({
      ...prev,
      spots: [...(prev.spots || []), {
        name: form.name!.trim(),
        address: form.address || '',
        note: form.note || '',
        category: form.category || '기타',
        rating: form.rating || 0,
        visited: form.visited || false,
        visitDate: form.visited ? todayStr : undefined,
      }]
    }))
    setForm({ category: '맛집', rating: 0 })
    setShowAdd(false)
  }

  const toggleVisited = (idx: number) => {
    const todayStr = new Date().toISOString().split('T')[0]
    updateData(prev => ({
      ...prev,
      spots: prev.spots.map((s, i) => i === idx ? {
        ...s,
        visited: !s.visited,
        visitDate: !s.visited ? todayStr : undefined,
      } : s)
    }))
  }

  const removeSpot = (idx: number) => {
    updateData(prev => ({
      ...prev,
      spots: prev.spots.filter((_, i) => i !== idx)
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
          <h2 className="text-lg font-black text-gray-800">📍 우리만의 지도</h2>
          <p className="text-xs text-gray-400 mt-0.5">함께 다녀온 장소를 기록해요</p>
        </div>
        <motion.button
          onClick={() => setShowAdd(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
        >
          <Plus size={20} />
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-4 flex items-center gap-4"
      >
        {[
          { value: totalCount, label: '전체 장소', color: 'text-gray-800' },
          { value: visitedCount, label: '방문 완료', color: 'text-primary' },
          { value: totalCount - visitedCount, label: '가볼 곳', color: 'text-secondary' },
        ].map((s, i) => (
          <div key={i} className="flex-1 text-center">
            {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-100/50" />}
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-gray-400">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3"
        style={{ maskImage: 'linear-gradient(90deg, black 90%, transparent 100%)' }}>
        {SPOT_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            className={`relative px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap border-[1.5px] transition-all shrink-0
              ${selectedCat === cat
                ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-[0_4px_12px_rgba(236,72,153,0.2)]'
                : 'bg-white/70 text-gray-500 border-white/50 backdrop-blur-sm'}`}>
            {cat !== '전체' && <span className="mr-1">{SPOT_EMOJIS[cat]}</span>}{cat}
          </button>
        ))}
      </div>

      {/* Spots List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl mb-4"
          >📍</motion.span>
          <h3 className="text-base font-extrabold text-gray-800 mb-1">아직 장소가 없어요</h3>
          <p className="text-sm text-gray-400">함께 다녀온 곳을 기록해보세요!</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {[...filtered].reverse().map((spot, i) => {
              const realIdx = spots.indexOf(spot)
              return (
                <motion.div
                  key={realIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.04 }}
                  className={`glass-card p-4 ${spot.visited ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={() => toggleVisited(realIdx)}>
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${spot.visited ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-gray-100/80'}`}
                      >
                        {SPOT_EMOJIS[spot.category || '기타'] || '📍'}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[14px] font-bold ${spot.visited ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {spot.name}
                          </span>
                          {spot.visited && (
                            <span className="text-[10px] bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-1.5 py-0.5 rounded-full font-bold border border-primary/10">
                              ✓ 방문
                            </span>
                          )}
                        </div>
                        {spot.address && <div className="text-[11px] text-gray-400 mt-0.5">{spot.address}</div>}
                        {spot.visited && spot.visitDate && (
                          <div className="text-[10px] text-gray-400 mt-0.5 font-semibold">
                            📅 {spot.visitDate.replace(/-/g, '.')} 방문
                          </div>
                        )}
                        {(spot.rating || 0) > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={12}
                                className={s <= (spot.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                            ))}
                          </div>
                        )}
                        {spot.note && <div className="text-[12px] text-gray-500 mt-1 italic">"{spot.note}"</div>}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => removeSpot(realIdx)}
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
                <h3 className="text-base font-extrabold text-gray-800">📍 새 장소 추가</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 -mr-1 text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>

              <div className="space-y-3">
                <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="장소 이름 *" autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />

                <input value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="주소 (선택)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />

                <div className="flex gap-2 flex-wrap">
                  {(['맛집', '카페', '술집', '여행', '데이트', '기타'] as const).map(cat => (
                    <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-bold border-[1.5px] transition
                        ${form.category === cat
                          ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200'}`}>
                      {SPOT_EMOJIS[cat]} {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">평점</span>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, rating: f.rating === s ? 0 : s }))}>
                      <Star size={20} className={s <= (form.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    </button>
                  ))}
                </div>

                <input value={form.note || ''} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="한줄 메모 (선택)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80" />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.visited || false}
                    onChange={e => setForm(f => ({ ...f, visited: e.target.checked }))}
                    className="w-4 h-4 rounded accent-pink-500" />
                  <span className="text-sm font-semibold text-gray-600">이미 다녀온 곳이에요</span>
                </label>

                <motion.button
                  onClick={addSpot}
                  disabled={!form.name?.trim()}
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
