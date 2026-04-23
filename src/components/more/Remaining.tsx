import { useState } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2, Check, MapPin, Star } from 'lucide-react'

// ===== MEMORIES =====
export function Memories() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', desc: '' })

  const save = () => {
    if (!form.title) return
    updateData(prev => ({ ...prev, memories: [...prev.memories, { ...form, date: form.date || new Date().toISOString().split('T')[0] }] }))
    setForm({ title: '', date: '', desc: '' }); setModal(false)
  }
  const remove = (idx: number) => updateData(prev => ({ ...prev, memories: prev.memories.filter((_, i) => i !== idx) }))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">📸</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">아직 추억이 없어요</h3>
          <button onClick={() => setModal(true)} className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">첫 추억 기록</button>
        </div>
      ) : (
        <div className="space-y-3">
          {[...data.memories].reverse().map((m, i) => (
            <div key={i} className="glass-card p-4 border-l-[3px] border-l-coral" style={{ borderRadius: '0 22px 22px 0' }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[15px] font-bold text-gray-800">{m.title}</div>
                  {m.desc && <div className="text-[13px] text-gray-500 mt-1">{m.desc}</div>}
                  <div className="text-[11px] text-gray-400 mt-1">{m.date}</div>
                </div>
                <button onClick={() => remove(data.memories.length - 1 - i)} className="p-1 text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">📸 추억 기록</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="어떤 순간이었나요?" rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4 resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== TIMECAPSULES =====
export function Timecapsules() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ message: '', openDate: '', from: 'me' })
  const today = new Date().toISOString().split('T')[0]

  const save = () => {
    if (!form.message || !form.openDate) return
    updateData(prev => ({ ...prev, timecapsules: [...prev.timecapsules, { ...form, createdAt: today, opened: false }] }))
    setForm({ message: '', openDate: '', from: 'me' }); setModal(false)
  }
  const open = (idx: number) => updateData(prev => ({ ...prev, timecapsules: prev.timecapsules.map((t, i) => i === idx ? { ...t, opened: true } : t) }))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.timecapsules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">📬</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">타임캡슐</h3>
          <p className="text-sm text-gray-400 mb-4">미래의 우리에게 편지를 보내요</p>
          <button onClick={() => setModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">캡슐 만들기</button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.timecapsules.map((t, i) => {
            const canOpen = t.openDate <= today
            return (
              <div key={i} className={`glass-card p-4 ${!canOpen && !t.opened ? 'border-l-[3px] border-l-lavender' : 'border-l-[3px] border-l-teal'}`} style={{ borderRadius: '0 22px 22px 0' }}>
                {t.opened ? (
                  <div>
                    <div className="text-[13px] text-gray-500 mb-1">📬 {t.createdAt}에 보낸 편지</div>
                    <div className="text-[14px] text-gray-800 font-medium whitespace-pre-wrap">{t.message}</div>
                  </div>
                ) : canOpen ? (
                  <div className="text-center">
                    <div className="text-xl mb-2">🎉</div>
                    <div className="text-sm font-bold text-teal mb-2">열 수 있어요!</div>
                    <button onClick={() => open(i)} className="px-4 py-2 rounded-xl bg-teal text-white text-sm font-bold">캡슐 열기</button>
                  </div>
                ) : (
                  <div>
                    <div className="text-[13px] text-gray-400">🔒 {t.openDate}에 열려요</div>
                    <div className="text-[12px] text-gray-300 mt-1">D-{Math.floor((new Date(t.openDate).getTime() - Date.now()) / 86400000)}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">📬 타임캡슐 만들기</h3>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="미래의 우리에게..." rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3 resize-none" />
            <label className="text-xs font-bold text-gray-500 mb-1 block">열리는 날짜</label>
            <input type="date" value={form.openDate} onChange={e => setForm(f => ({ ...f, openDate: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">묻기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== BIRTHDAYS =====
export function Birthdays() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', date: '', relation: '' })

  const save = () => {
    if (!form.name || !form.date) return
    updateData(prev => ({ ...prev, birthdays: [...prev.birthdays, { ...form }] }))
    setForm({ name: '', date: '', relation: '' }); setModal(false)
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.birthdays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">🎂</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">등록된 생일이 없어요</h3>
          <button onClick={() => setModal(true)} className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">생일 등록</button>
        </div>
      ) : (
        <div className="space-y-2">
          {data.birthdays.map((b, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-3">
              <span className="text-2xl">🎂</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800">{b.name} {b.relation && <span className="text-gray-400">({b.relation})</span>}</div>
                <div className="text-xs text-gray-400">{b.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">🎂 생일 등록</h3>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="이름" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))} placeholder="관계 (엄마, 친구 등)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== WISHLIST =====
export function Wishlist() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', price: '', link: '' })

  const save = () => {
    if (!form.title) return
    updateData(prev => ({ ...prev, wishes: [...prev.wishes, { ...form, done: false }] }))
    setForm({ title: '', price: '', link: '' }); setModal(false)
  }
  const toggle = (idx: number) => updateData(prev => ({ ...prev, wishes: prev.wishes.map((w, i) => i === idx ? { ...w, done: !w.done } : w) }))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.wishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">🎁</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">위시리스트가 비어있어요</h3>
          <button onClick={() => setModal(true)} className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">추가하기</button>
        </div>
      ) : (
        <div className="space-y-2">
          {data.wishes.map((w, i) => (
            <div key={i} onClick={() => toggle(i)} className={`glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${w.done ? 'opacity-50' : ''}`}>
              <span className="text-lg">{w.done ? '✅' : '🎁'}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${w.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{w.title}</div>
                {w.price && <div className="text-xs text-gray-400">{w.price}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">🎁 위시 추가</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="갖고 싶은 것" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="가격 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== DATE SPOTS =====
export function DateSpots() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', note: '' })

  const save = () => {
    if (!form.name) return
    updateData(prev => ({ ...prev, spots: [...prev.spots, { ...form, visited: false }] }))
    setForm({ name: '', address: '', note: '' }); setModal(false)
  }
  const toggle = (idx: number) => updateData(prev => ({ ...prev, spots: prev.spots.map((s, i) => i === idx ? { ...s, visited: !s.visited } : s) }))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.spots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">📍</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">가고 싶은 곳을 저장해요</h3>
          <button onClick={() => setModal(true)} className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">장소 추가</button>
        </div>
      ) : (
        <div className="space-y-2">
          {data.spots.map((s, i) => (
            <div key={i} onClick={() => toggle(i)} className={`glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${s.visited ? 'opacity-50' : ''}`}>
              <MapPin size={18} className={s.visited ? 'text-teal' : 'text-coral'} />
              <div className="flex-1">
                <div className={`text-sm font-bold ${s.visited ? 'text-gray-400' : 'text-gray-800'}`}>{s.name}</div>
                {s.address && <div className="text-xs text-gray-400">{s.address}</div>}
              </div>
              {s.visited && <Check size={16} className="text-teal" />}
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">📍 장소 추가</h3>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="장소 이름" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="주소 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="메모 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== SAVINGS =====
export function Savings() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', target: '', current: '' })

  const save = () => {
    if (!form.title || !form.target) return
    updateData(prev => ({ ...prev, savings: [...prev.savings, { title: form.title, target: Number(form.target), current: Number(form.current) || 0, date: new Date().toISOString().split('T')[0] }] }))
    setForm({ title: '', target: '', current: '' }); setModal(false)
  }
  const addAmount = (idx: number, amount: number) => {
    updateData(prev => ({ ...prev, savings: prev.savings.map((s, i) => i === idx ? { ...s, current: Math.min(s.target, s.current + amount) } : s) }))
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.savings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">💰</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">함께 저축 목표를 세워요</h3>
          <button onClick={() => setModal(true)} className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">목표 만들기</button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.savings.map((s, i) => {
            const pct = Math.round(s.current / s.target * 100)
            return (
              <div key={i} className="glass-card p-5">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-bold text-gray-800">{s.title}</div>
                  <div className="text-xs font-bold text-teal">{pct}%</div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-teal-light to-teal rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{s.current.toLocaleString()}원</span>
                  <span>{s.target.toLocaleString()}원</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {[1000, 5000, 10000].map(a => (
                    <button key={a} onClick={() => addAmount(i, a)} className="flex-1 py-2 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 hover:bg-mint-bg transition">+{(a/1000)}천</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">💰 저축 목표</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="목표 (예: 여행 자금)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="목표 금액" type="number" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== WATCHLIST =====
export function WatchlistView() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', type: '영화' })

  const save = () => {
    if (!form.title) return
    updateData(prev => ({ ...prev, watchlist: [...prev.watchlist, { ...form, watched: false }] }))
    setForm({ title: '', type: '영화' }); setModal(false)
  }
  const toggle = (idx: number) => updateData(prev => ({ ...prev, watchlist: prev.watchlist.map((w, i) => i === idx ? { ...w, watched: !w.watched } : w) }))

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">🎬</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">같이 볼 콘텐츠</h3>
          <button onClick={() => setModal(true)} className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">추가하기</button>
        </div>
      ) : (
        <div className="space-y-2">
          {data.watchlist.map((w, i) => (
            <div key={i} onClick={() => toggle(i)} className={`glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition ${w.watched ? 'opacity-50' : ''}`}>
              <span className="text-lg">{w.type === '영화' ? '🎬' : w.type === '드라마' ? '📺' : '🎵'}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${w.watched ? 'line-through text-gray-400' : 'text-gray-800'}`}>{w.title}</div>
                <div className="text-xs text-gray-400">{w.type}</div>
              </div>
              {w.watched && <Star size={16} className="text-gold fill-gold" />}
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40"><Plus size={22} /></button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">🎬 볼거리 추가</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <div className="flex gap-2 mb-4">
              {['영화', '드라마', '예능'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${form.type === t ? 'bg-teal text-white' : 'bg-gray-50 text-gray-500'}`}>{t}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">저장</button>
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
    { emoji: '💬', label: '대화 수', value: data.chat.length },
    { emoji: '📸', label: '사진', value: data.album.length },
    { emoji: '💌', label: '편지', value: data.memos.length },
    { emoji: '📅', label: '일정', value: data.events.length },
    { emoji: '😊', label: '기분 기록', value: data.moods.history.length },
    { emoji: '🏆', label: '미션 완료', value: data.missions.filter(m => m.done).length },
    { emoji: '📸', label: '추억', value: data.memories.length },
    { emoji: '🎁', label: '위시', value: data.wishes.length },
    { emoji: '📍', label: '데이트 장소', value: data.spots.length },
    { emoji: '🔥', label: '최고 스트릭', value: data.streak.best },
  ]

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-6 text-center mb-4">
        <div className="text-sm text-gray-500 mb-1">우리의 기록</div>
        <div className="text-3xl font-black text-teal">{stats.reduce((s, v) => s + v.value, 0)}</div>
        <div className="text-xs text-gray-400">총 활동 수</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className="text-xl mb-1">{s.emoji}</div>
            <div className="text-lg font-black text-gray-800">{s.value}</div>
            <div className="text-[10px] text-gray-400 font-bold">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
