import { useState } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2 } from 'lucide-react'

// ===== WATCHLIST =====
export function Watchlist() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', type: '영화' })
  const types = ['영화', '드라마', '예능', '애니', '다큐']

  const save = () => {
    if (!form.title.trim()) return
    updateData(prev => ({ ...prev, watchlist: [...prev.watchlist, { ...form, watched: false }] }))
    setForm({ title: '', type: '영화' })
    setModal(false)
  }

  const toggle = (idx: number) => updateData(prev => ({ ...prev, watchlist: prev.watchlist.map((w, i) => i === idx ? { ...w, watched: !w.watched } : w) }))
  const remove = (idx: number) => updateData(prev => ({ ...prev, watchlist: prev.watchlist.filter((_, i) => i !== idx) }))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">🎬</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">같이 볼 거 추가해요</h3>
          <button onClick={() => setModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg mt-2">추가하기</button>
        </div>
      ) : (
        <div className="space-y-2">
          {data.watchlist.map((w, i) => (
            <div key={i} onClick={() => toggle(i)} className={`glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${w.watched ? 'opacity-50' : ''}`}>
              <span className="text-2xl">{w.type === '영화' ? '🎬' : w.type === '드라마' ? '📺' : w.type === '애니' ? '🎌' : '📹'}</span>
              <div className="flex-1">
                <div className={`text-[14px] font-bold ${w.watched ? 'line-through text-gray-400' : 'text-gray-800'}`}>{w.title}</div>
                <div className="text-[11px] text-gray-400">{w.type}</div>
              </div>
              <span>{w.watched ? '✅' : '⬜'}</span>
              <button onClick={e => { e.stopPropagation(); remove(i) }} className="p-1 text-gray-300 hover:text-red-400"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">🎬 볼 거 추가</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <div className="flex gap-2 mb-4">
              {types.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${form.type === t ? 'bg-teal text-white' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>{t}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== STATS =====
export function Stats() {
  const { data } = useFirebase()

  const stats = [
    { label: '대화 수', value: data.chat.length, emoji: '💬' },
    { label: '사진 수', value: data.album.length, emoji: '📸' },
    { label: '편지 수', value: data.memos.length, emoji: '💌' },
    { label: '추억 수', value: data.memories.length, emoji: '📸' },
    { label: '일정 수', value: data.events.length, emoji: '📅' },
    { label: '위시 수', value: data.wishes.length, emoji: '🎁' },
    { label: '미션 완료', value: data.missions.filter(m => m.done).length, emoji: '🏆' },
    { label: '기분 기록', value: data.moods.history.length, emoji: '😊' },
    { label: '데이트 장소', value: data.spots.length, emoji: '📍' },
    { label: '볼거리', value: data.watchlist.length, emoji: '🎬' },
  ]

  const total = stats.reduce((s, st) => s + st.value, 0)

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-6 text-center mb-4">
        <div className="text-sm text-gray-500 mb-1">총 활동</div>
        <div className="text-4xl font-black text-teal">{total}</div>
        <div className="text-xs text-gray-400">개의 기록이 쌓였어요</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-xl font-black text-gray-800">{s.value}</div>
            <div className="text-[10px] font-bold text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
