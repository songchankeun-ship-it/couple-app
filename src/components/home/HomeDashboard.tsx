import { useState } from 'react'
import { useFirebase } from '../../contexts/FirebaseContext'
// icons not needed for now

const QUICK_PINGS = ['❤️', '🥰', '😘', '🤗', '💕', '😊', '🫶', '💪']

const QUESTIONS = [
  { cat: '일상', text: '오늘 하루 중 가장 좋았던 순간은?', emoji: '🌤️' },
  { cat: '우리 관계', text: '내가 가장 매력적으로 보이는 순간은?', emoji: '💕' },
  { cat: '재미', text: '100억이 생기면 제일 먼저 뭐 할 거야?', emoji: '💰' },
  { cat: '일상', text: '요즘 가장 자주 듣는 노래는?', emoji: '🎵' },
  { cat: '우리 관계', text: '가장 기억에 남는 데이트는?', emoji: '🎡' },
  { cat: '미래', text: '5년 뒤 우리는 어디에 있을까?', emoji: '🔮' },
  { cat: '재미', text: '나를 동물로 표현한다면?', emoji: '🦊' },
  { cat: '깊은 대화', text: '관계에서 가장 중요한 가치는 뭐야?', emoji: '🧠' },
  { cat: 'TMI', text: '상대방 때문에 새로 좋아하게 된 것은?', emoji: '💡' },
  { cat: '일상', text: '이번 주말에 뭐 하고 싶어?', emoji: '🏖️' },
  { cat: '우리 관계', text: '우리가 함께할 때 가장 행복한 순간은?', emoji: '🥰' },
  { cat: '재미', text: '우리 둘을 영화 장르로 표현한다면?', emoji: '🎬' },
  { cat: '미래', text: '같이 살게 되면 가장 기대되는 것은?', emoji: '🏠' },
  { cat: '깊은 대화', text: '내가 힘들 때 어떻게 해주면 좋겠어?', emoji: '🤗' },
  { cat: 'TMI', text: '상대방이 잘 때 귀여운 습관은?', emoji: '😴' },
  { cat: '일상', text: '지금 이 순간 먹고 싶은 것은?', emoji: '🤤' },
  { cat: '우리 관계', text: '오늘 상대방한테 점수를 준다면 몇 점?', emoji: '💯' },
  { cat: '재미', text: '상대방을 이모지 3개로 표현한다면?', emoji: '😏' },
  { cat: '미래', text: '함께 여행하고 싶은 나라 TOP 3는?', emoji: '🌍' },
  { cat: '깊은 대화', text: '사랑이란 뭐라고 생각해?', emoji: '💌' },
  { cat: '일상', text: '오늘 하루를 이모지 하나로 표현한다면?', emoji: '😊' },
  { cat: '우리 관계', text: '상대방에게 감사한 점 3가지는?', emoji: '🙏' },
  { cat: '재미', text: '우리 커플 유튜브 채널을 만든다면 주제는?', emoji: '📹' },
  { cat: 'TMI', text: '상대방 폰에서 가장 먼저 볼 것은?', emoji: '📱' },
]

export default function HomeDashboard() {
  const { data, updateData, connected, roomName } = useFirebase()
  const [pingSent, setPingSent] = useState(false)

  const diffDays = data.ddayDate
    ? Math.floor((Date.now() - new Date(data.ddayDate).getTime()) / 86400000) + 1
    : 0

  const streakEmoji = data.streak.current >= 365 ? '👑' :
    data.streak.current >= 100 ? '💎' :
    data.streak.current >= 30 ? '🔥' :
    data.streak.current >= 7 ? '⚡' :
    data.streak.current >= 3 ? '✨' : '💤'

  // 오늘의 질문
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const dayIdx = Math.floor((today.getTime() - new Date(2024, 0, 1).getTime()) / 86400000)
  const todayQ = QUESTIONS[dayIdx % QUESTIONS.length]
  const dailyData = data.questions?.daily?.[todayStr] || {}
  const myAnswered = !!dailyData.me

  const sendPing = (emoji: string) => {
    updateData(prev => ({
      ...prev,
      chat: [...prev.chat, {
        text: emoji,
        from: prev.names.me || '나',
        time: `${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')}`,
        date: todayStr,
      }]
    }))
    setPingSent(true)
    setTimeout(() => setPingSent(false), 2000)
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero - D-Day */}
      <div className="hero-gradient relative rounded-[32px] overflow-hidden mx-4 mt-2 mb-5 px-5 py-10 text-center shadow-[0_12px_40px_rgba(236,72,153,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.1)_0%,transparent_40%)]" />

        <div className="relative z-10">
          {data.ddayDate ? (
            <>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold text-white/90 mb-3 border border-white/15">
                💕 우리가 함께한 날
              </div>
              <div className="text-[72px] font-black text-white tracking-tighter leading-none mb-1 drop-shadow-lg animate-bounce-in">
                {diffDays}
              </div>
              <div className="text-[12px] font-bold text-white/70 tracking-[3px] uppercase mb-4">
                days together
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
                  {streakEmoji} {data.streak.current}일 연속
                </span>
              </div>
            </>
          ) : (
            <div className="text-white text-lg font-bold animate-float">💕 사귄 날짜를 설정해주세요</div>
          )}
        </div>

        {/* Connection badge */}
        {roomName && (
          <div className="relative z-10 mt-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${connected ? 'bg-white/20 text-white/90 border border-white/25' : 'bg-yellow-400/20 text-yellow-100 border border-yellow-300/30'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-yellow-300'}`} />
              {connected ? `🔗 ${roomName}` : '⏳ 연결 중...'}
            </span>
          </div>
        )}

        {/* Floating decorations */}
        {['💖', '✨', '🌸', '💫'].map((emoji, i) => (
          <span key={i} className="absolute text-sm animate-float opacity-60"
            style={{ left: `${[8, 82, 42, 92][i]}%`, top: `${[12, 18, 72, 55][i]}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${2.5 + i * 0.5}s` }}>
            {emoji}
          </span>
        ))}

        {/* Sparkles */}
        {[15, 75, 50, 90].map((left, i) => (
          <span key={`s${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-white animate-sparkle shadow-[0_0_6px_rgba(255,255,255,0.6)]"
            style={{ left: `${left}%`, top: `${20 + i * 15}%`, animationDelay: `${i * 0.6}s` }} />
        ))}

        <div className="absolute -bottom-px left-0 right-0 h-8 bg-bg rounded-t-[28px] z-20" />
      </div>

      {/* Profile Section */}
      <div className="flex items-center justify-center gap-6 py-2 mb-3">
        <div className="text-center animate-fade-in-up stagger-1">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-2xl border-[3px] border-white shadow-[0_4px_20px_rgba(236,72,153,0.15)] overflow-hidden">
              {data.couplePhoto ? <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" /> : '🧑'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-xs animate-wiggle">💝</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-2">{data.names.me || '나'}</div>
        </div>

        <div className="flex flex-col items-center gap-1 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-1">
            <div className="w-5 h-px bg-gradient-to-r from-transparent to-pink-300" />
            <span className="text-lg animate-heartbeat">💕</span>
            <div className="w-5 h-px bg-gradient-to-r from-pink-300 to-transparent" />
          </div>
          {data.ddayDate && (
            <span className="text-[10px] font-bold text-pink-300">D+{diffDays}</span>
          )}
        </div>

        <div className="text-center animate-fade-in-up stagger-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-2xl border-[3px] border-white shadow-[0_4px_20px_rgba(236,72,153,0.15)] overflow-hidden">
              {data.couplePhoto ? <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" /> : '👩'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-xs animate-wiggle" style={{ animationDelay: '0.5s' }}>💝</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-2">{data.names.you || '너'}</div>
        </div>
      </div>

      {/* Quick Ping */}
      <div className="glass-card mx-4 mb-3 p-4 animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-bold text-gray-500">💌 한줄 핑</div>
          {pingSent && <span className="text-[11px] font-bold text-pink-400 animate-bounce-in">전송됨! 💕</span>}
        </div>
        <div className="flex gap-2 justify-center">
          {QUICK_PINGS.map(emoji => (
            <button key={emoji} onClick={() => sendPing(emoji)}
              className="w-10 h-10 rounded-xl bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-xl active:scale-90 transition border border-pink-100">
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 오늘의 질문 미리보기 */}
      <div className="glass-card mx-4 mb-3 p-4 bg-gradient-to-br from-mint-bg/80 via-green-50/60 to-white border-teal/10 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold text-teal">❓ 오늘의 질문</div>
          {myAnswered && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">✓ 답변 완료</span>}
        </div>
        <div className="text-[15px] font-extrabold text-gray-800 leading-relaxed">
          {todayQ.text}
        </div>
        {!myAnswered && (
          <div className="text-[11px] text-pink-400 mt-2 font-semibold">
            탭해서 답변하기 →
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-4 animate-fade-in-up stagger-4">
        <div className="glass-card p-2.5 text-center">
          <div className="text-lg mb-0.5">📸</div>
          <div className="text-base font-black text-gray-800">{data.album.length}</div>
          <div className="text-[9px] text-pink-400 font-bold">추억</div>
        </div>
        <div className="glass-card p-2.5 text-center">
          <div className="text-lg mb-0.5">💬</div>
          <div className="text-base font-black text-gray-800">{data.chat.length}</div>
          <div className="text-[9px] text-pink-400 font-bold">대화</div>
        </div>
        <div className="glass-card p-2.5 text-center">
          <div className="text-lg mb-0.5">📍</div>
          <div className="text-base font-black text-gray-800">{(data.spots || []).length}</div>
          <div className="text-[9px] text-pink-400 font-bold">장소</div>
        </div>
      </div>

      {/* Last Photo */}
      {data.album.length > 0 && (
        <div className="glass-card col-span-2 h-[150px] overflow-hidden mx-4 mb-4 animate-fade-in-up">
          <div className="relative w-full h-full">
            <img src={data.album[data.album.length - 1].src} alt="" className="w-full h-full object-cover rounded-[22px]" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-pink-900/40 to-transparent px-4 pt-6 pb-3 rounded-b-[22px]">
              <span className="text-white text-xs font-bold flex items-center gap-1">🌸 {data.album.length}장의 추억</span>
            </div>
          </div>
        </div>
      )}

      <div className="h-20" />
    </div>
  )
}
