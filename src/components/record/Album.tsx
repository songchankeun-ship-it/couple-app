import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebase } from '../../contexts/FirebaseContext'
import { Plus, Trash2, X } from 'lucide-react'
import { EmptyState } from '../shared/CoupleCharacter'

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

  const photos = [...data.album].reverse()

  return (
    <div className="px-4 pb-24 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-serif)' }}>앨범</h2>
          <p className="text-[11px] text-text-muted mt-0.5">{data.album.length}장의 사진</p>
        </div>
        <motion.button
          onClick={addPhoto}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {data.album.length === 0 ? (
        <EmptyState
          pose="camera"
          title="아직 사진이 없어요"
          subtitle="우리의 소중한 순간을 남겨보세요"
          action={{ label: '첫 사진 추가', onClick: addPhoto }}
          gender="couple"
        />
      ) : (
        /* Masonry-style grid: alternating tall/short */
        <div className="columns-2 gap-2.5 space-y-2.5">
          {photos.map((photo, i) => {
            const isTall = i % 3 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
                onClick={() => setViewIdx(data.album.length - 1 - i)}
                className={`break-inside-avoid rounded-2xl overflow-hidden cursor-pointer relative group border border-border-light shadow-sm`}
                style={{ aspectRatio: isTall ? '3/4' : '4/3' }}
              >
                <img
                  src={photo.src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photo.date && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent pt-6 pb-2 px-3">
                    <span className="text-[9px] font-bold text-white/90 tracking-wide">
                      {photo.date.slice(2).replace(/-/g, '.')}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              src={data.album[viewIdx].src}
              alt=""
              className="max-w-full max-h-[70vh] rounded-2xl"
            />
            {data.album[viewIdx].date && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-4 text-sm font-bold text-white/70"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {data.album[viewIdx].date.replace(/-/g, '.')}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 mt-5"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); remove(viewIdx) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/20 text-red-300 font-bold text-sm border border-red-500/20"
              >
                <Trash2 size={14} /> 삭제
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewIdx(null)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 text-white/80 font-bold text-sm border border-white/10"
              >
                <X size={14} /> 닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
