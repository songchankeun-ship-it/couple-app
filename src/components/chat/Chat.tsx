import { useState, useRef, useEffect } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Send } from 'lucide-react'

const IDENTITY_KEY = 'couple_chat_identity'

export default function Chat() {
  const { data, updateData } = useFirebase()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Per-device identity: 'me' or 'you' (stored in localStorage)
  const [identity, setIdentity] = useState<'me' | 'you' | null>(() => {
    const saved = localStorage.getItem(IDENTITY_KEY)
    return saved === 'me' || saved === 'you' ? saved : null
  })

  const myName = identity === 'you' ? (data.names.you || '상대') : (data.names.me || '나')
  const partnerName = identity === 'you' ? (data.names.me || '나') : (data.names.you || '상대')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data.chat.length])

  const pickIdentity = (id: 'me' | 'you') => {
    localStorage.setItem(IDENTITY_KEY, id)
    setIdentity(id)
  }

  const send = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    updateData(prev => ({
      ...prev,
      chat: [...prev.chat, {
        text,
        from: myName,
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        date: now.toISOString().split('T')[0],
      }]
    }))
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // Identity picker screen
  if (!identity) {
    const name1 = data.names.me || '사용자1'
    const name2 = data.names.you || '사용자2'
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] gap-6 px-6">
        <span className="text-5xl animate-bounce">💬</span>
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-gray-700 mb-1">누구로 채팅할까요?</h2>
          <p className="text-xs text-gray-400">이 기기에서 사용할 이름을 선택하세요</p>
        </div>
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={() => pickIdentity('me')}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 text-white font-bold text-base shadow-lg active:scale-95 transition"
          >
            {name1}
          </button>
          <button
            onClick={() => pickIdentity('you')}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 text-white font-bold text-base shadow-lg active:scale-95 transition"
          >
            {name2}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Identity indicator */}
      <div className="flex items-center justify-center gap-2 py-2 text-[11px]">
        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-500 font-bold">
          {myName}(으)로 채팅 중
        </span>
        <button
          onClick={() => { localStorage.removeItem(IDENTITY_KEY); setIdentity(null) }}
          className="px-2 py-1 rounded-full bg-gray-100 text-gray-400 font-medium hover:bg-gray-200 transition"
        >
          변경
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {data.chat.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-4xl mb-3 animate-bounce">💬</span>
            <p className="text-sm font-semibold">첫 메시지를 보내보세요!</p>
          </div>
        )}
        {data.chat.map((msg, i) => {
          const isMe = msg.from === myName || (!identity || identity === 'me') && (msg.from === '나' || msg.from === 'me')
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col gap-0.5" style={{ maxWidth: '75%' }}>
                {/* Sender name */}
                {!isMe && (
                  <span className={`text-[10px] font-semibold text-purple-400 ${isMe ? 'text-right' : 'text-left'} px-2`}>
                    {msg.from || partnerName}
                  </span>
                )}
                <div className={`px-4 py-2.5 text-[14px] leading-relaxed
                  ${isMe
                    ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-[20px_20px_6px_20px] shadow-[0_2px_12px_rgba(236,72,153,0.25)]'
                    : 'bg-white text-gray-800 rounded-[20px_20px_20px_6px] shadow-[0_2px_10px_rgba(26,44,53,0.08)] border border-purple-100'
                  }`}>
                  <p>{msg.text}</p>
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-[calc(1rem+env(safe-area-inset-bottom)+60px)] pt-2">
        <div className="flex items-end gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 pl-4">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="메시지를 입력하세요..."
            rows={1}
            className="flex-1 resize-none outline-none text-[14px] py-2 max-h-24 bg-transparent"
          />
          <button onClick={send}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white flex items-center justify-center shrink-0 disabled:opacity-30 active:scale-90 transition">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
