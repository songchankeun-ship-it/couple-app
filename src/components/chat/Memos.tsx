import { useState } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2 } from 'lucide-react'

export default function Memos() {
  const { data, updateData } = useFirebase()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', from: 'me' })

  const save = () => {
    if (!form.body.trim()) return
    updateData(prev => ({
      ...prev,
      memos: [...prev.memos, { ...form, date: new Date().toISOString().split('T')[0] }]
    }))
    setForm({ title: '', body: '', from: 'me' })
    setModal(false)
  }

  const remove = (idx: number) => {
    updateData(prev => ({ ...prev, memos: prev.memos.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {data.memos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4 animate-bounce">💌</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">아직 편지가 없어요</h3>
          <p className="text-sm text-gray-400 mb-4">마음을 담은 편지를 써보세요</p>
          <button onClick={() => setModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg">첫 편지 쓰기</button>
        </div>
      ) : (
        <div className="space-y-3">
          {[...data.memos].reverse().map((memo, i) => (
            <div key={i} className="glass-card p-5 border-l-[3px] border-l-coral" style={{ borderRadius: '0 22px 22px 0' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {memo.title && <div className="text-[15px] font-bold text-gray-800 mb-1">{memo.title}</div>}
                  <div className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">{memo.body || memo.text}</div>
                  <div className="text-[11px] text-gray-400 mt-2">{memo.date} · {memo.from === 'me' ? (data.names.me || '나') : (data.names.you || '너')}</div>
                </div>
                <button onClick={() => remove(data.memos.length - 1 - i)} className="p-1.5 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition ml-2">
                  <Trash2 size={14} />
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
          <div className="bg-white rounded-t-[28px] w-full max-w-[480px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-center mb-5">💌 편지 쓰기</h3>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="제목 (선택)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-3" />
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="마음을 담아 편지를 써주세요..." rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal outline-none text-sm mb-4 resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">취소</button>
              <button onClick={save} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-light to-teal-dark text-white font-bold text-sm shadow-lg active:scale-[0.97]">보내기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
