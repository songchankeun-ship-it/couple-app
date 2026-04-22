import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus } from 'lucide-react'

export default function Album() {
  const { data, updateData } = useFirebase()
  const [viewIdx, setViewIdx] = useState<number | null>(null)

  const addPhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const max = 800
          let w = img.width, h = img.height
          if (w > max) { h = h * max / w; w = max }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
          const src = canvas.toDataURL('image/jpeg', 0.7)
          updateData(prev => ({ ...prev, album: [...prev.album, { src, date: new Date().toISOString().split('T')[0] }] }))
        }
        img.src = ev.target!.result as string
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const remove = (idx: number) => {
    updateData(prev => ({ ...prev, album: prev.album.filter((_, i) => i !== idx) }))
    setViewIdx(null)
  }

  return (
    <div className="px-4 pb-24">
      {data.album.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl mb-4"
          >🖼️</motion.span>
          <h3 className="text-lg font-extrabold text-gray-800 mb-2">아직 사진이 없어요</h3>
          <p className="text-sm text-gray-400 mb-4">우리의 소중한 순간을 남겨보세요</p>
          <motion.button
            onClick={addPhoto}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_8px_24px_rgba(236,72,153,0.25)] btn-glow"
          >
            첫 사진 추가
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 pt-3">
          <motion.div
            onClick={addPhoto}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="aspect-square rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 flex flex-col items-center justify-center cursor-pointer gap-1 shadow-[0_2px_12px_rgba(167,139,250,0.08)]"
          >
            <Plus size={24} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400">추가</span>
          </motion.div>
          {[...data.album].reverse().map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: 'spring' }}
              onClick={() => setViewIdx(data.album.length - 1 - i)}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-[0_2px_12px_rgba(167,139,250,0.08)] relative group"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                src={photo.src}
                alt=""
                className="w-full h-full object-cover"
              />
              {photo.date && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent pt-4 pb-1.5 px-2">
                  <span className="text-[9px] font-semibold text-white/90">
                    {photo.date.slice(5).replace('-', '.')}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {viewIdx !== null && data.album[viewIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center"
            onClick={() => setViewIdx(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              src={data.album[viewIdx].src}
              alt=""
              className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl"
            />
            {data.album[viewIdx].date && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <span className="text-[13px] font-semibold text-white/80">
                  📅 {data.album[viewIdx].date.replace(/-/g, '.')}
                </span>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mt-4"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); remove(viewIdx) }}
                className="px-6 py-3 rounded-xl bg-red-500/80 text-white font-bold text-sm backdrop-blur-sm"
              >삭제</motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewIdx(null)}
                className="px-6 py-3 rounded-xl bg-white/20 text-white font-bold text-sm backdrop-blur-sm border border-white/20"
              >닫기</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
