import { useState } from 'react'
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

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 animate-fade-in-up">
        <div className="text-6xl mb-4 animate-bounce">💕</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">서윤 & 찬근</h1>
        <p className="text-sm text-gray-400 mb-8">우리만의 공간을 만들어요</p>

        <button onClick={() => setStep('setup')}
          className="w-full max-w-[320px] py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold text-base shadow-[0_8px_32px_rgba(236,72,153,0.3)] active:scale-[0.97] transition">
          시작하기 🚀
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 animate-fade-in-up">
      <div className="text-5xl mb-3">💑</div>
      <h1 className="text-xl font-black text-gray-800 mb-1">기본 정보 설정</h1>
      <p className="text-sm text-gray-400 mb-8">간단한 정보만 입력하면 돼요</p>

      <div className="w-full max-w-[380px] space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">내 이름 (닉네임) *</label>
          <input value={myName} onChange={e => setMyName(e.target.value)}
            placeholder="이름 또는 닉네임"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-400 outline-none text-sm" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">상대 이름 (닉네임)</label>
          <input value={partnerName} onChange={e => setPartnerName(e.target.value)}
            placeholder="상대방 이름"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-400 outline-none text-sm" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">사귄 날짜 (선택)</label>
          <input type="date" value={ddayDate} onChange={e => setDdayDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-400 outline-none text-sm" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">실시간 동기화 (선택)</label>
          <input value={roomName} onChange={e => setRoomName(e.target.value)}
            placeholder="같은 방 이름 → 실시간 공유"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-400 outline-none text-sm" />
          <p className="text-[10px] text-gray-400 mt-1">상대방도 같은 이름으로 입장하면 데이터가 동기화돼요</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => setStep('welcome')}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm">
            ← 뒤로
          </button>
          <button onClick={handleFinish} disabled={!myName.trim()}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold text-sm active:scale-[0.97] disabled:opacity-40 shadow-lg">
            완료 💕
          </button>
        </div>
      </div>
    </div>
  )
}
