import { useState } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2, Check } from 'lucide-react'

// ===== TODOS (프로젝트/친구모임/결혼준비) =====
export function Todos() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', assignee: '', dueDate: '', category: '' })

  const todos = data.todos || []
  const save = () => {
    if (!form.title.trim()) return
    updateData(prev => ({ ...prev, todos: [...(prev.todos || []), { ...form, done: false }] }))
    setForm({ title: '', assignee: '', dueDate: '', category: '' })
    setModal(false)
  }
  const toggle = (idx: number) => {
    updateData(prev => ({ ...prev, todos: (prev.todos || []).map((t, i) => i === idx ? { ...t, done: !t.done } : t) }))
  }
  const remove = (idx: number) => {
    updateData(prev => ({ ...prev, todos: (prev.todos || []).filter((_, i) => i !== idx) }))
  }
  const done = todos.filter(t => t.done).length

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-4 mb-4 text-center">
        <div className="text-sm text-gray-500">진행률</div>
        <div className="text-2xl font-black text-teal">{done} / {todos.length}</div>
        {todos.length > 0 && (
          <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${todos.length ? (done / todos.length * 100) : 0}%` }} />
          </div>
        )}
      </div>
      {todos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm font-semibold">할 일을 추가해보세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((t, i) => (
            <div key={i} className={`glass-card p-4 flex items-center gap-3 ${t.done ? 'opacity-50' : ''}`}>
              <button onClick={() => toggle(i)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${t.done ? 'bg-teal border-teal' : 'border-gray-200'}`}>
                {t.done && <Check size={14} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${t.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.title}</div>
                <div className="flex gap-2 mt-0.5">
                  {t.assignee && <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-semibold">{t.assignee}</span>}
                  {t.dueDate && <span className="text-[10px] text-gray-400">{t.dueDate}</span>}
                </div>
              </div>
              <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 transition"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40">
        <Plus size={22} />
      </button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">📋 할 일 추가</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="할 일" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <div className="flex gap-2 mb-3">
              <input value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} placeholder="담당자 (선택)" className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm" />
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm" />
            </div>
            <button onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm active:scale-[0.97]">추가</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== POLLS (투표) =====
export function Polls() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const polls = data.polls || []
  const myName = data.names.me || '나'

  const save = () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) return
    updateData(prev => ({
      ...prev,
      polls: [...(prev.polls || []), { question: question.trim(), options: options.filter(o => o.trim()), votes: {}, createdAt: new Date().toISOString() }]
    }))
    setQuestion(''); setOptions(['', '']); setModal(false)
  }
  const vote = (pollIdx: number, optionIdx: number) => {
    updateData(prev => ({
      ...prev,
      polls: (prev.polls || []).map((p, i) => i === pollIdx ? { ...p, votes: { ...p.votes, [myName]: p.options[optionIdx] } } : p)
    }))
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {polls.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🗳️</div>
          <p className="text-sm font-semibold">투표를 만들어보세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...polls].reverse().map((poll, pi) => {
            const realIdx = polls.length - 1 - pi
            const myVote = poll.votes?.[myName]
            const totalVotes = Object.keys(poll.votes || {}).length
            return (
              <div key={pi} className="glass-card p-5">
                <div className="text-[15px] font-bold text-gray-800 mb-3">{poll.question}</div>
                <div className="space-y-2">
                  {poll.options.map((opt: string, oi: number) => {
                    const voteCount = Object.values(poll.votes || {}).filter(v => v === opt).length
                    const pct = totalVotes ? Math.round(voteCount / totalVotes * 100) : 0
                    const isMyVote = myVote === opt
                    return (
                      <button key={oi} onClick={() => vote(realIdx, oi)}
                        className={`w-full p-3 rounded-xl text-sm font-semibold text-left relative overflow-hidden transition border-2 ${isMyVote ? 'border-teal bg-teal/5' : 'border-gray-100'}`}>
                        {myVote && <div className="absolute inset-y-0 left-0 bg-teal/10 transition-all" style={{ width: `${pct}%` }} />}
                        <div className="relative flex justify-between">
                          <span>{opt}</span>
                          {myVote && <span className="text-teal text-xs">{pct}%</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="text-[10px] text-gray-400 mt-2">{totalVotes}명 투표</div>
              </div>
            )
          })}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40">
        <Plus size={22} />
      </button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">🗳️ 투표 만들기</h3>
            <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="질문" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            {options.map((opt, i) => (
              <input key={i} value={opt} onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o) }}
                placeholder={`선택지 ${i + 1}`} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-2" />
            ))}
            <button onClick={() => setOptions(o => [...o, ''])} className="text-xs text-teal font-bold mb-4">+ 선택지 추가</button>
            <button onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm active:scale-[0.97]">만들기</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== BUDGET (정산/예산) =====
export function Budget() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', paidBy: '', category: '' })
  const budget = data.budget || []
  const total = budget.reduce((s, b) => s + (b.amount || 0), 0)

  const save = () => {
    if (!form.title.trim() || !form.amount) return
    updateData(prev => ({
      ...prev,
      budget: [...(prev.budget || []), { title: form.title, amount: Number(form.amount), paidBy: form.paidBy || data.names.me, category: form.category, paid: true, date: new Date().toISOString().split('T')[0] }]
    }))
    setForm({ title: '', amount: '', paidBy: '', category: '' })
    setModal(false)
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-5 mb-4 text-center">
        <div className="text-sm text-gray-500">총 지출</div>
        <div className="text-2xl font-black text-teal">{total.toLocaleString()}원</div>
      </div>
      {budget.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-sm font-semibold">지출을 기록해보세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...budget].reverse().map((b, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">{b.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{b.paidBy && `${b.paidBy} · `}{b.date}</div>
              </div>
              <div className="text-sm font-bold text-teal">{(b.amount || 0).toLocaleString()}원</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40">
        <Plus size={22} />
      </button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">💰 지출 추가</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="항목" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="금액 (원)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.paidBy} onChange={e => setForm(f => ({ ...f, paidBy: e.target.value }))} placeholder="결제자 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <button onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm active:scale-[0.97]">추가</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== CHECKLIST (체크리스트) =====
export function Checklist() {
  const { data, updateData } = useFirebase()
  const [input, setInput] = useState('')
  const checklist = data.checklist || []
  const done = checklist.filter(c => c.checked).length

  const add = () => {
    if (!input.trim()) return
    updateData(prev => ({ ...prev, checklist: [...(prev.checklist || []), { title: input.trim(), checked: false }] }))
    setInput('')
  }
  const toggle = (idx: number) => {
    updateData(prev => ({ ...prev, checklist: (prev.checklist || []).map((c, i) => i === idx ? { ...c, checked: !c.checked } : c) }))
  }
  const remove = (idx: number) => {
    updateData(prev => ({ ...prev, checklist: (prev.checklist || []).filter((_, i) => i !== idx) }))
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      <div className="glass-card p-4 mb-4 text-center">
        <div className="text-sm text-gray-500">완료</div>
        <div className="text-2xl font-black text-teal">{done} / {checklist.length}</div>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="항목 추가..." className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm" />
        <button onClick={add} className="px-5 py-3 rounded-xl bg-teal text-white font-bold text-sm active:scale-95">추가</button>
      </div>
      <div className="space-y-2">
        {checklist.map((c, i) => (
          <div key={i} className={`glass-card p-3 flex items-center gap-3 ${c.checked ? 'opacity-50' : ''}`}>
            <button onClick={() => toggle(i)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${c.checked ? 'bg-teal border-teal' : 'border-gray-200'}`}>
              {c.checked && <Check size={14} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm ${c.checked ? 'line-through text-gray-400' : 'text-gray-800 font-semibold'}`}>{c.title}</span>
            <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== VENDORS (업체 관리 - 결혼준비) =====
export function Vendors() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', phone: '', note: '', price: '' })
  const vendors = data.vendors || []

  const save = () => {
    if (!form.name.trim()) return
    updateData(prev => ({
      ...prev,
      vendors: [...(prev.vendors || []), { name: form.name, category: form.category || '기타', phone: form.phone, note: form.note, price: Number(form.price) || 0, confirmed: false }]
    }))
    setForm({ name: '', category: '', phone: '', note: '', price: '' })
    setModal(false)
  }
  const toggleConfirm = (idx: number) => {
    updateData(prev => ({ ...prev, vendors: (prev.vendors || []).map((v, i) => i === idx ? { ...v, confirmed: !v.confirmed } : v) }))
  }

  const categories = ['스드메', '웨딩홀', '예복', '혼수', '신혼여행', '기타']

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {vendors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🏢</div>
          <p className="text-sm font-semibold">업체를 등록해보세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {vendors.map((v, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{v.name}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{v.category}</span>
                  </div>
                  {v.phone && <div className="text-xs text-gray-400 mt-1">📞 {v.phone}</div>}
                  {v.note && <div className="text-xs text-gray-500 mt-1">{v.note}</div>}
                  {!!v.price && <div className="text-xs text-teal font-bold mt-1">{v.price?.toLocaleString()}원</div>}
                </div>
                <button onClick={() => toggleConfirm(i)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${v.confirmed ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                  {v.confirmed ? '확정' : '미정'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40">
        <Plus size={22} />
      </button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">🏢 업체 등록</h3>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="업체명" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3 bg-white">
              <option value="">카테고리 선택</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="전화번호 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="견적 금액 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="메모 (선택)" rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4 resize-none" />
            <button onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm active:scale-[0.97]">등록</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== ROLES (역할 분담 - 프로젝트) =====
export function Roles() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', role: '' })
  const roles = data.roles || []

  const save = () => {
    if (!form.name.trim() || !form.role.trim()) return
    updateData(prev => ({ ...prev, roles: [...(prev.roles || []), { name: form.name, role: form.role, tasks: [] }] }))
    setForm({ name: '', role: '' })
    setModal(false)
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {roles.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-sm font-semibold">역할을 분담해보세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {roles.map((r, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-light to-teal-dark flex items-center justify-center text-white font-bold text-sm">
                {r.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800">{r.name}</div>
                <div className="text-xs text-gray-400">{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setModal(true)} className="fixed bottom-20 right-[calc(50%-220px)] w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-light to-teal-dark text-white shadow-lg flex items-center justify-center active:scale-90 transition z-40">
        <Plus size={22} />
      </button>
      {modal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center" onClick={() => setModal(false)}>
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">👥 역할 추가</h3>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="이름" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="역할 (예: 디자인, 개발, 기획)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4" />
            <button onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm active:scale-[0.97]">추가</button>
          </div>
        </div>
      )}
    </div>
  )
}
