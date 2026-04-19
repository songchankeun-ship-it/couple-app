import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'

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
  const [pingEmoji, setPingEmoji] = useState('')

  const diffDays = data.ddayDate
    ? Math.floor((Date.now() - new Date(data.ddayDate).getTime()) / 86400000) + 1
    : 0

  const streakEmoji = data.streak.current >= 365 ? '👑' :
    data.streak.current >= 100 ? '💎' :
    data.streak.current >= 30 ? '🔥' :
    data.streak.current >= 7 ? '⚡' :
    data.streak.current >= 3 ? '✨' : '💤'

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
    setPingEmoji(emoji)
    setPingSent(true)
    setTimeout(() => setPingSent(false), 2000)
  }

  return (
    <div className="pb-24">
      {/* ── Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="hero-gradient relative rounded-[28px] overflow-hidden mx-4 mt-3 mb-5 shadow-[0_16px_48px_rgba(167,139,250,0.25)]"
      >
        {/* Animated blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full animate-blob" />
        <div className="absolute bottom-[-15%] right-[-5%] w-48 h-48 bg-white/8 rounded-full animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-20 h-20 bg-white/10 rounded-full animate-blob" style={{ animationDelay: '4s' }} />

        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer pointer-events-none" />

        <div className="relative z-10 px-6 py-10 text-center">
          {data.ddayDate ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold text-white/90 mb-4 border border-white/20"
              >
                💕 우리가 함께한 날
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                className="text-[72px] font-black text-white tracking-tighter leading-none mb-1 glow-text"
              >
                {diffDays}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[12px] font-bold text-white/60 tracking-[4px] uppercase mb-5"
              >
                days together
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
                  {streakEmoji} {data.streak.current}일 연속
                </span>
              </motion.div>
            </>
          ) : (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-white text-lg font-bold"
            >
              💕 사귄 날짜를 설정해주세요
            </motion.div>
          )}
        </div>

        {/* Connection badge */}
        {roomName && (
          <div className="relative z-10 pb-5 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm
              ${connected
                ? 'bg-white/15 text-white/90 border border-white/20'
                : 'bg-yellow-400/20 text-yellow-100 border border-yellow-300/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-yellow-300'}`} />
              {connected ? `🔗 ${roomName}` : '⏳ 연결 중...'}
            </span>
          </div>
        )}

        {/* Floating sparkles */}
        {[15, 75, 50, 88].map((left, i) => (
          <motion.span
            key={`s${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `${left}%`, top: `${18 + i * 16}%` }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}

      </motion.div>

      {/* ── Profile Section ── */}
      <div className="flex items-center justify-center gap-6 py-2 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center text-2xl border-[3px] border-white shadow-[0_4px_24px_rgba(236,72,153,0.2)] overflow-hidden">
              {data.couplePhoto ? <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" /> : '🧑'}
            </div>
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 text-xs"
            >💝</motion.span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-2">{data.names.me || '나'}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-primary-light" />
            <span className="text-xl animate-heartbeat">💕</span>
            <div className="w-6 h-px bg-gradient-to-r from-primary-light to-transparent" />
          </div>
          {data.ddayDate && (
            <span className="text-[10px] font-extrabold gradient-text">D+{diffDays}</span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-light to-primary-light flex items-center justify-center text-2xl border-[3px] border-white shadow-[0_4px_24px_rgba(167,139,250,0.2)] overflow-hidden">
              {data.couplePhoto ? <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" /> : '👩'}
            </div>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-0.5 -right-0.5 text-xs"
            >💝</motion.span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-2">{data.names.you || '너'}</div>
        </motion.div>
      </div>

      {/* ── Quick Ping ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card mx-4 mb-3 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[10px]">💌</span>
            한줄 핑
          </div>
          <AnimatePresence>
            {pingSent && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[11px] font-bold gradient-text"
              >
                {pingEmoji} 전송됨!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 justify-center">
          {QUICK_PINGS.map((emoji, i) => (
            <motion.button
              key={emoji}
              onClick={() => sendPing(emoji)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85, rotate: [0, -10, 10, 0] }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.04, type: 'spring', stiffness: 400 }}
              className="w-10 h-10 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center text-xl border border-white/50 shadow-[0_2px_12px_rgba(167,139,250,0.1)] backdrop-blur-sm"
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Today's Question Preview ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card mx-4 mb-3 p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/10 to-transparent rounded-full -mr-6 -mt-6" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-[12px]">❓</span>
              <span className="text-[11px] font-bold text-gray-500">오늘의 질문</span>
            </div>
            {myAnswered && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[10px] bg-gradient-to-r from-primary/10 to-secondary/10 text-primary-dark px-2.5 py-0.5 rounded-full font-bold border border-primary/10"
              >
                ✓ 답변 완료
              </motion.span>
            )}
          </div>
          <div className="text-[15px] font-extrabold text-gray-800 leading-relaxed">
            {todayQ.text}
          </div>
          {!myAnswered && (
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[11px] gradient-text mt-2.5 font-bold"
            >
              탭해서 답변하기 →
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-3 gap-2.5 px-4 mb-4">
        {[
          { emoji: '📸', value: data.album.length, label: '추억', delay: 0.7 },
          { emoji: '💬', value: data.chat.length, label: '대화', delay: 0.75 },
          { emoji: '📍', value: (data.spots || []).length, label: '장소', delay: 0.8 },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className="glass-card p-3 text-center"
          >
            <div className="text-lg mb-0.5">{stat.emoji}</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: stat.delay + 0.2 }}
              className="text-lg font-black gradient-text"
            >
              {stat.value}
            </motion.div>
            <div className="text-[9px] text-gray-400 font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Last Photo ── */}
      {data.album.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="glass-card h-[150px] overflow-hidden mx-4 mb-4"
        >
          <div className="relative w-full h-full">
            <img src={data.album[data.album.length - 1].src} alt="" className="w-full h-full object-cover rounded-[22px]" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent px-4 pt-8 pb-3 rounded-b-[22px]">
              <span className="text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm bg-white/10 rounded-full px-3 py-1 w-fit">
                🌸 {data.album.length}장의 추억
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="h-4" />
    </div>
  )
}
