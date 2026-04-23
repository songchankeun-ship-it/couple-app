import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { SPACE_PRESETS } from '../../types/data'
import type { SpaceType, CoupleData } from '../../types/data'
import { Download, Upload } from 'lucide-react'

export default function Settings() {
  const { data, updateData, setField, connected, roomName, connectToRoom, disconnect } = useFirebase()
  const [editNames, setEditNames] = useState(false)
  const [myName, setMyName] = useState(data.names.me || '')
  const [yourName, setYourName] = useState(data.names.you || '')
  const [editDday, setEditDday] = useState(false)
  const [ddayInput, setDdayInput] = useState(data.ddayDate || '')
  const [roomInput, setRoomInput] = useState('')
  const [showRoom, setShowRoom] = useState(false)
  const [showSpaceType, setShowSpaceType] = useState(false)
  const [toast, setToast] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const changeSpaceType = (type: SpaceType) => {
    localStorage.removeItem('couple_space_reset')
    updateData(prev => ({ ...prev, spaceType: type, spaceName: SPACE_PRESETS[type].label }))
    setShowSpaceType(false)
    showToast(`${SPACE_PRESETS[type].emoji} ${SPACE_PRESETS[type].label} 공간으로 변경됨!`)
  }

  const resetToOnboarding = () => {
    try {
      localStorage.setItem('couple_space_reset', 'true')
    } catch {}
    updateData(prev => {
      const next = { ...prev }
      delete (next as any).spaceType
      return next
    })
    showToast('공간 유형을 선택해주세요')
  }

  const saveNames = () => {
    updateData(prev => ({ ...prev, names: { me: myName.trim() || '나', you: yourName.trim() || '너' } }))
    setEditNames(false)
    showToast('이름이 변경되었어요!')
  }

  const saveDday = () => {
    if (!ddayInput) return
    setField('ddayDate', ddayInput)
    setEditDday(false)
    showToast('사귄 날짜가 설정되었어요!')
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 400
        let w = img.width, h = img.height
        const ratio = Math.min(size / w, size / h)
        w *= ratio; h *= ratio
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        const src = canvas.toDataURL('image/jpeg', 0.8)
        updateData(prev => ({ ...prev, couplePhoto: src }))
        showToast('사진이 변경되었어요!')
      }
      img.src = ev.target!.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleConnect = () => {
    const room = roomInput.trim()
    if (!room) return
    connectToRoom(room)
    setShowRoom(false)
    setRoomInput('')
    showToast(`"${room}" 방에 연결했어요!`)
  }

  const exportData = useCallback(() => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `couple-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('백업 파일이 다운로드됐어요!')
  }, [data])

  const importData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target!.result as string) as Partial<CoupleData>
        if (!imported.names || !imported.chat) {
          showToast('올바른 백업 파일이 아니에요')
          return
        }
        updateData(() => imported as CoupleData)
        showToast('데이터가 복원되었어요!')
      } catch {
        showToast('파일을 읽을 수 없어요')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [updateData])

  const diffDays = data.ddayDate
    ? Math.floor((Date.now() - new Date(data.ddayDate).getTime()) / 86400000) + 1
    : 0

  return (
    <div className="px-4 pb-24">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl bg-gray-800/90 backdrop-blur-md text-white text-sm font-bold shadow-lg"
        >
          {toast}
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-3 text-center mt-3"
      >
        <div className="relative inline-block mb-3">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => photoRef.current?.click()}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mx-auto cursor-pointer overflow-hidden border-4 border-white shadow-[0_8px_24px_rgba(236,72,153,0.15)]"
          >
            {data.couplePhoto ? (
              <img src={data.couplePhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">💑</span>
            )}
          </motion.div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs shadow-md cursor-pointer"
            onClick={() => photoRef.current?.click()}>
            📷
          </div>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
        <div className="text-lg font-black text-gray-800">
          {data.names.me || '나'} <span className="gradient-text">❤️</span> {data.names.you || '너'}
        </div>
        {data.ddayDate && (
          <div className="text-xs text-gray-400 mt-1">만난 지 <span className="gradient-text font-bold">{diffDays}</span>일</div>
        )}
      </motion.div>

      {/* Name Setting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold text-gray-800">👤 이름 설정</div>
          <button onClick={() => { setEditNames(!editNames); setMyName(data.names.me || ''); setYourName(data.names.you || '') }}
            className="text-xs gradient-text font-bold">{editNames ? '취소' : '변경'}</button>
        </div>
        {editNames ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">나</span>
              <input value={myName} onChange={e => setMyName(e.target.value)} placeholder="내 이름"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary bg-white/80" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">너</span>
              <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="상대방 이름"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary bg-white/80" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={saveNames}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm">저장</motion.button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 mt-1">
            {data.names.me || '(미설정)'} & {data.names.you || '(미설정)'}
          </div>
        )}
      </motion.div>

      {/* D-day Setting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold text-gray-800">💕 사귄 날짜</div>
          <button onClick={() => { setEditDday(!editDday); setDdayInput(data.ddayDate || '') }}
            className="text-xs gradient-text font-bold">{editDday ? '취소' : '변경'}</button>
        </div>
        {editDday ? (
          <div className="mt-3 space-y-2">
            <input type="date" value={ddayInput} onChange={e => setDdayInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary bg-white/80" />
            <motion.button whileTap={{ scale: 0.97 }} onClick={saveDday}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm">저장</motion.button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 mt-1">
            {data.ddayDate ? `${data.ddayDate} (${diffDays}일째)` : '아직 설정하지 않았어요'}
          </div>
        )}
      </motion.div>

      {/* Firebase Room */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold text-gray-800">🔗 실시간 동기화</div>
          <button onClick={() => setShowRoom(!showRoom)}
            className="text-xs gradient-text font-bold">{showRoom ? '닫기' : '설정'}</button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : roomName ? 'bg-yellow-400' : 'bg-gray-300'}`} />
          <span className="text-xs text-gray-500">
            {connected ? `${roomName} 연결됨` : roomName ? `${roomName} 연결 중...` : '연결 안 됨'}
          </span>
        </div>
        {showRoom && (
          <div className="mt-3 space-y-2">
            {roomName ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-gray-50/80 text-sm text-gray-600">현재: {roomName}</div>
                <button onClick={() => { disconnect(); showToast('연결 해제됨') }}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-500 font-bold text-xs">해제</button>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <input value={roomInput} onChange={e => setRoomInput(e.target.value)}
                placeholder="방 이름 입력 (예: 우리집)"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary bg-white/80" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleConnect}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs">연결</motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Space Type */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold text-gray-800">🏠 공간 유형</div>
          <button onClick={() => setShowSpaceType(!showSpaceType)}
            className="text-xs gradient-text font-bold">{showSpaceType ? '닫기' : '변경'}</button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {data.spaceType ? `${SPACE_PRESETS[data.spaceType].emoji} ${SPACE_PRESETS[data.spaceType].label}` : '미설정'}
        </div>
        {showSpaceType && (
          <div className="mt-3 space-y-2">
            {(Object.entries(SPACE_PRESETS) as [SpaceType, typeof SPACE_PRESETS[SpaceType]][]).map(([type, preset]) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.97 }}
                onClick={() => changeSpaceType(type)}
                className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition border-2 ${data.spaceType === type ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5' : 'border-gray-100 hover:border-primary/20'}`}
              >
                <span className="text-2xl">{preset.emoji}</span>
                <div>
                  <div className="text-sm font-bold text-gray-800">{preset.label}</div>
                  <div className="text-[10px] text-gray-400">{preset.desc}</div>
                </div>
                {data.spaceType === type && <span className="ml-auto text-xs font-bold gradient-text">현재</span>}
              </motion.button>
            ))}
            <button onClick={resetToOnboarding}
              className="w-full p-3 rounded-xl text-center text-xs text-gray-400 border-2 border-dashed border-gray-200 hover:border-gray-300 transition mt-2">
              🏠 처음 화면으로 돌아가기
            </button>
          </div>
        )}
      </motion.div>

      {/* Data Backup */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4 mb-3">
        <div className="text-sm font-bold text-gray-800 mb-3">💾 데이터 백업</div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={exportData}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center gap-2 text-sm font-bold text-primary"
          >
            <Download size={16} />
            내보내기
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => importRef.current?.click()}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center gap-2 text-sm font-bold text-primary"
          >
            <Upload size={16} />
            가져오기
          </motion.button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={importData} />
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">JSON 파일로 데이터를 백업하고 복원할 수 있어요</p>
      </motion.div>

      {/* App Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-4 mb-3">
        <div className="text-sm font-bold text-gray-800 mb-2">📱 앱 정보</div>
        <div className="space-y-1.5 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>버전</span><span className="font-semibold gradient-text">v3.0 ✨</span>
          </div>
          <div className="flex justify-between">
            <span>데이터</span><span className="font-semibold">{data.chat.length}개 채팅 · {data.events.length}개 일정 · {data.album.length}장 사진</span>
          </div>
          <div className="flex justify-between">
            <span>Firebase</span><span className="font-semibold">{connected ? '✅ 연결됨' : '❌ 미연결'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
