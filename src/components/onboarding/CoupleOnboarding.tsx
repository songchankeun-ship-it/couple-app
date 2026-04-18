import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'

export default function CoupleOnboarding() {
  const { updateData, connectToRoom } = useFirebase()
  const [step, setStep] = useState<'welcome' | 'setup'>('welcome')
  const [myName, setMyName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [ddayDate, setDdayDate] = useState('')
  const [roomName, setRoomName] = useState('')

  const handleFinish = () => {
    if (!myName.trim()) return
    localStorage.removeItem('couple_space_reset')
    updateData(prev => ({
      ...prev,
      spaceType: 'couple',
      spaceName: '우리 둘',
      names: { me: myName.trim(), you: partnerName.trim() || '상대' },
      ddayDate: ddayDate || null,
    }))
    if (roomName.trim()) {
      connectToRoom(roomName.trim())
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-[-10%] right-[-15%] w-72 h-72 bg-gradient-to-tl from-secondary/15 to-primary/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] left-[60%] w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-blob" style={{ animationDelay: '5s' }} />

      <AnimatePresence mode="wait">
        {step === 'welcome' ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative z-10"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-5"
            >💕</motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black gradient-text mb-2"
            >
              서윤 & 찬근
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-400 mb-10"
            >
              우리만의 공간을 만들어요
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep('setup')}
              className="w-full max-w-[320px] py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-[0_12px_40px_rgba(236,72,153,0.3)] btn-glow animate-glow-pulse"
            >
              시작하기 🚀
            </motion.button>

            {/* Floating particles */}
            {[20, 50, 80].map((left, i) => (
              <motion.span
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40"
                style={{ left: `${left}%`, top: `${25 + i * 20}%` }}
                animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-5xl mb-3"
            >💑</motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-black text-gray-800 mb-1"
            >기본 정보 설정</motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-400 mb-8"
            >간단한 정보만 입력하면 돼요</motion.p>

            <div className="w-full max-w-[380px] space-y-4">
              {[
                { label: '내 이름 (닉네임) *', value: myName, set: setMyName, placeholder: '이름 또는 닉네임', delay: 0.2 },
                { label: '상대 이름 (닉네임)', value: partnerName, set: setPartnerName, placeholder: '상대방 이름', delay: 0.25 },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: f.delay }}
                >
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">{f.label}</label>
                  <input
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80 backdrop-blur-sm transition"
                  />
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">사귄 날짜 (선택)</label>
                <input type="date" value={ddayDate} onChange={e => setDdayDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80 backdrop-blur-sm" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">실시간 동기화 (선택)</label>
                <input value={roomName} onChange={e => setRoomName(e.target.value)}
                  placeholder="같은 방 이름 → 실시간 공유"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm bg-white/80 backdrop-blur-sm" />
                <p className="text-[10px] text-gray-400 mt-1">상대방도 같은 이름으로 입장하면 데이터가 동기화돼요</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 pt-2"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('welcome')}
                  className="flex-1 py-3.5 rounded-xl glass-card-solid text-gray-500 font-bold text-sm"
                >
                  ← 뒤로
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinish}
                  disabled={!myName.trim()}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm disabled:opacity-40 shadow-[0_8px_24px_rgba(236,72,153,0.25)]"
                >
                  완료 💕
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
