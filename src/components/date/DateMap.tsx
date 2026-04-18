import { useState } from 'react'
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
    updateData(prev => ({
      ...prev,
      spots: [...(prev.spots || []), {
        name: form.name!.trim(),
        address: form.address || '',
        note: form.note || '',
        category: form.category || '기타',
        rating: form.rating || 0,
        visited: form.visited || false,
      }]
    }))
    setForm({ category: '맛집', rating: 0 })
    setShowAdd(false)
  }

  const toggleVisited = (idx: number) => {
    updateData(prev => ({
      ...prev,
      spots: prev.spots.map((s, i) => i === idx ? { ...s, visited: !s.visited } : s)
    }))
  }

  const removeSpot = (idx: number) => {
    updateData(prev => ({
      ...prev,
      spots: prev.spots.filter((_, i) => i !== idx)
    }))
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div>
          <h2 className="text-lg font-black text-gray-800">📍 우리만의 지도</h2>
          <p className="text-xs text-gray-400 mt-0.5">함께 다녀온 장소를 기록해요</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition">
          <Plus size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="glass-card p-4 mb-4 flex items-center gap-4">
        <div className="flex-1 text-center">
          <div className="text-2xl font-black text-gray-800">{totalCount}</div>
          <div className="text-[10px] font-bold text-gray-400">전체 장소</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="flex-1 text-center">
          <div className="text-2xl font-black text-pink-500">{visitedCount}</div>
          <div className="text-[10px] font-bold text-gray-400">방문 완료</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="flex-1 text-center">
          <div className="text-2xl font-black text-teal">{totalCount - visitedCount}</div>
          <div className="text-[10px] font-bold text-gray-400">가볼 곳</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3"
        style={{ maskImage: 'linear-gradient(90deg, black 90%, transparent 100%)' }}>
        {SPOT_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap border-[1.5px] transition-all shrink-0
              ${selectedCat === cat
                ? 'bg-teal text-white border-teal'
                : 'bg-white text-gray-500 border-gray-200'}`}>
            {cat !== '전체' && <span className="mr-1">{SPOT_EMOJIS[cat]}</span>}{cat}
          </button>
        ))}
      </div>

      {/* Spots List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-5xl mb-4 animate-float">📍</span>
          <h3 className="text-base font-extrabold text-gray-800 mb-1">아직 장소가 없어요</h3>
          <p className="text-sm text-gray-400">함께 다녀온 곳을 기록해보세요!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...filtered].reverse().map((spot, i) => {
            const realIdx = spots.indexOf(spot)
            return (
              <div key={i} className={`glass-card p-4 ${spot.visited ? 'opacity-75' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1" onClick={() => toggleVisited(realIdx)}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${spot.visited ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      {SPOT_EMOJIS[spot.category || '기타'] || '📍'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] font-bold ${spot.visited ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {spot.name}
                        </span>
                        {spot.visited && <span className="text-[10px] bg-pink-100 text-pink-500 px-1.5 py-0.5 rounded-full font-bold">✓ 방문</span>}
                      </div>
                      {spot.address && <div className="text-[11px] text-gray-400 mt-0.5">{spot.address}</div>}
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
                  <button onClick={() => removeSpot(realIdx)}
                    className="p-1.5 text-gray-300 hover:text-red-400 transition shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-[480px] p-5 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-gray-800">📍 새 장소 추가</h3>
              <button onClick={() => setShowAdd(false)} className="p-1 text-gray-400"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="장소 이름 *" autoFocus
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm" />

              <input value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="주소 (선택)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm" />

              {/* Category */}
              <div className="flex gap-2 flex-wrap">
                {(['맛집', '카페', '술집', '여행', '데이트', '기타'] as const).map(cat => (
                  <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold border-[1.5px] transition
                      ${form.category === cat ? 'bg-teal text-white border-teal' : 'bg-white text-gray-500 border-gray-200'}`}>
                    {SPOT_EMOJIS[cat]} {cat}
                  </button>
                ))}
              </div>

              {/* Rating */}
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm" />

              {/* Visited toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.visited || false}
                  onChange={e => setForm(f => ({ ...f, visited: e.target.checked }))}
                  className="w-4 h-4 rounded accent-pink-500" />
                <span className="text-sm font-semibold text-gray-600">이미 다녀온 곳이에요</span>
              </label>

              <button onClick={addSpot} disabled={!form.name?.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-extrabold text-[15px] shadow-lg disabled:opacity-30 active:scale-[0.97] transition">
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
