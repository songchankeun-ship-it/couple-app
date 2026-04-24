import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { CouplePair, EmptyState } from '../shared/CoupleCharacter'

const QUICK_PINGS = ['❤️', '🥰', '😘', '🤗', '💕', '😊', '🫶', '💪']

const QUESTIONS = [
  { cat: '일상', text: '오늘 하루 중 가장 좋았던 순간은?', emoji: '🌤️' },
  { cat: '일상', text: '요즘 가장 자주 듣는 노래는?', emoji: '🎵' },
  { cat: '일상', text: '오늘 하루를 이모지 하나로 표현한다면?', emoji: '😊' },
  { cat: '추억', text: '가장 기억에 남는 데이트는?', emoji: '🎡' },
  { cat: '추억', text: '둘이 가장 많이 웃었던 날은 언제야?', emoji: '😂' },
  { cat: '추억', text: '처음 만났을 때 첫인상은 어땠어?', emoji: '✨' },
  { cat: '감사', text: '상대방에게 감사한 점 3가지는?', emoji: '🙏' },
  { cat: '감사', text: '오늘 상대방한테 점수를 준다면 몇 점?', emoji: '💯' },
  { cat: '감사', text: '상대방이 나한테 해준 것 중 가장 감동적인 것은?', emoji: '🥹' },
  { cat: '우리 관계', text: '내가 가장 매력적으로 보이는 순간은?', emoji: '💕' },
  { cat: '우리 관계', text: '우리가 함께할 때 가장 행복한 순간은?', emoji: '🥰' },
  { cat: '우리 관계', text: '우리만의 특별한 습관이나 루틴이 있다면?', emoji: '💑' },
  { cat: '속마음', text: '관계에서 가장 중요한 가치는 뭐야?', emoji: '🧠' },
  { cat: '속마음', text: '내가 힘들 때 어떻게 해주면 좋겠어?', emoji: '🤗' },
  { cat: '속마음', text: '사랑이란 뭐라고 생각해?', emoji: '💌' },
  { cat: '버킷리스트', text: '함께 여행하고 싶은 나라 TOP 3는?', emoji: '🌍' },
  { cat: '버킷리스트', text: '같이 살게 되면 가장 기대되는 것은?', emoji: '🏠' },
  { cat: '버킷리스트', text: '5년 뒤 우리는 어디에 있을까?', emoji: '🔮' },
  { cat: '재미', text: '100억이 생기면 제일 먼저 뭐 할 거야?', emoji: '💰' },
  { cat: '재미', text: '나를 동물로 표현한다면?', emoji: '🦊' },
  { cat: '재미', text: '우리 둘을 영화 장르로 표현한다면?', emoji: '🎬' },
  { cat: 'TMI', text: '상대방 때문에 새로 좋아하게 된 것은?', emoji: '💡' },
  { cat: 'TMI', text: '상대방이 잘 때 귀여운 습관은?', emoji: '😴' },
  { cat: 'TMI', text: '이번 주말에 뭐 하고 싶어?', emoji: '🏖️' },
]

export default function HomeDashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
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
      {/* ── Full-screen Hero with Character ── */}
      <div className="relative min-h-[55vh] flex flex-col items-center justify-center px-6">
        {/* Soft gradient background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary-light/30 blur-3xl" />
          <div className="absolute -bottom-10 -right-20 w-48 h-48 rounded-full bg-secondary-light/30 blur-3xl" />
          <div className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
        </div>

        {/* Connection badge (top) */}
        {roomName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4"
          >
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold
              ${connected
                ? 'bg-accent/15 text-accent border border-accent/20'
                : 'bg-gold/15 text-gold border border-gold/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-accent animate-pulse' : 'bg-gold'}`} />
              {connected ? roomName : '연결 중...'}
            </span>
          </motion.div>
        )}

        {/* Character couple */}
        <div className="relative z-10 mt-8">
          {data.ddayDate ? (
            <CouplePair pose="love" size={55} gap={-8} />
          ) : (
            <CouplePair pose="wave" size={55} gap={-8} />
          )}
        </div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex items-center gap-3 mt-3 mb-2"
        >
          <span className="text-sm font-bold text-text-primary">{data.names.me || '나'}</span>
          <span className="text-primary text-xs">&</span>
          <span className="text-sm font-bold text-text-primary">{data.names.you || '너'}</span>
        </motion.div>

        {/* D-day counter */}
        {data.ddayDate ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[56px] font-black text-text-primary tracking-tighter leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
                {diffDays}
              </span>
              <span className="text-sm font-bold text-text-muted ml-1">일째</span>
            </div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-2 mb-3"
            />
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-light/50 text-xs font-bold text-primary-dark border border-primary/10">
                {streakEmoji} {data.streak.current}일 연속
              </span>
            </div>
          </motion.div>
        ) : (
          <EmptyState
            pose="wave"
            title="사귄 날짜를 설정해주세요"
            subtitle="설정에서 기념일을 등록하면 D-day가 표시돼요"
            gender="couple"
            size={50}
          />
        )}
      </div>

      {/* ── Quick Ping (horizontal scroll) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 mb-5"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-text-muted tracking-wide uppercase">Quick Ping</span>
          <AnimatePresence>
            {pingSent && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[11px] font-bold text-primary"
              >
                {pingEmoji} 전송됨!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          {QUICK_PINGS.map((emoji, i) => (
            <motion.button
              key={emoji}
              onClick={() => sendPing(emoji)}
              whileTap={{ scale: 0.8, rotate: [0, -15, 15, 0] }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="flex-1 aspect-square rounded-2xl bg-surface flex items-center justify-center text-xl border border-border-light shadow-sm active:bg-primary-light/20 transition-colors"
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Today's Question (full-width card) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNavigate?.('questions')}
        className="mx-4 mb-5 relative overflow-hidden rounded-3xl bg-surface border border-border-light shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      >
        {/* Accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-l-3xl" />

        <div className="p-5 pl-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Today's Question</span>
            {myAnswered && (
              <span className="text-[10px] bg-accent/10 text-accent px-2.5 py-0.5 rounded-full font-bold border border-accent/15">
                답변 완료
              </span>
            )}
          </div>
          <p className="text-[15px] font-bold text-text-primary leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
            {todayQ.text}
          </p>
          {!myAnswered && (
            <motion.p
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[11px] text-primary mt-3 font-bold"
            >
              탭해서 답변하기 →
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 px-4 mb-5"
      >
        {[
          { value: data.album.length, label: '사진', color: 'primary' },
          { value: data.chat.length, label: '대화', color: 'secondary' },
          { value: (data.spots || []).length, label: '장소', color: 'accent' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65 + i * 0.08 }}
            className="flex-1 py-4 rounded-2xl bg-surface border border-border-light text-center shadow-sm"
          >
            <div className="text-xl font-black text-text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
              {stat.value}
            </div>
            <div className="text-[10px] text-text-muted font-bold mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Last Photo (cinematic crop) ── */}
      {data.album.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mx-4 mb-4 rounded-3xl overflow-hidden shadow-sm border border-border-light"
          style={{ aspectRatio: '16/9' }}
        >
          <div className="relative w-full h-full">
            <img src={data.album[data.album.length - 1].src} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-5 pt-10 pb-4">
              <span className="text-white text-xs font-bold tracking-wide">{data.album.length}장의 추억</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="h-8" />
    </div>
  )
}
