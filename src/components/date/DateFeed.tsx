import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ChevronRight } from 'lucide-react'
import { useFirebase } from '../../contexts/FirebaseContext'

interface DateCourse {
  id: string
  title: string
  desc: string
  category: string
  emoji: string
  tags: string[]
  spots: { name: string; type: string }[]
}

const CATEGORIES = ['전체', '실내', '야외', '맛집투어', '감성', '액티비티', '절약'] as const

const CURATED_COURSES: DateCourse[] = [
  {
    id: '1', emoji: '🌸', category: '야외',
    title: '한강 피크닉 코스',
    desc: '치킨 포장해서 한강 나들이! 자전거 타고 노을까지 보면 완벽',
    tags: ['봄/가을 추천', '야외', '저렴'],
    spots: [
      { name: '편의점 장보기', type: '준비' },
      { name: '한강공원 도착', type: '피크닉' },
      { name: '자전거 대여', type: '액티비티' },
      { name: '노을 스팟에서 사진', type: '포토' },
    ]
  },
  {
    id: '2', emoji: '🎨', category: '감성',
    title: '미술관 & 카페 코스',
    desc: '전시 보고 감성 카페에서 이야기꽃 피우기',
    tags: ['비 오는 날', '감성', '문화'],
    spots: [
      { name: '미술관/갤러리', type: '문화' },
      { name: '근처 감성 카페', type: '카페' },
      { name: '소품샵 구경', type: '쇼핑' },
    ]
  },
  {
    id: '3', emoji: '🍕', category: '맛집투어',
    title: '먹방 데이트',
    desc: '핫한 맛집 2~3곳 돌면서 조금씩 먹기',
    tags: ['맛집', '푸드투어', '주말'],
    spots: [
      { name: '브런치/파스타', type: '식사' },
      { name: '디저트 카페', type: '카페' },
      { name: '야시장/포차', type: '저녁' },
    ]
  },
  {
    id: '4', emoji: '🎬', category: '실내',
    title: '영화 & 맛집 코스',
    desc: '영화관에서 최신작 보고 맛집 가는 클래식 코스',
    tags: ['주말', '편안함', '클래식'],
    spots: [
      { name: '영화관', type: '영화' },
      { name: '맛집 또는 카페', type: '식사' },
      { name: '산책로', type: '산책' },
    ]
  },
  {
    id: '5', emoji: '🏃', category: '액티비티',
    title: '원데이클래스 데이트',
    desc: '도자기, 향수, 캔들 등 함께 만들며 추억 쌓기',
    tags: ['체험', '특별한 날', '기념일'],
    spots: [
      { name: '원데이클래스', type: '체험' },
      { name: '근처 맛집', type: '식사' },
      { name: '포토부스', type: '기념' },
    ]
  },
  {
    id: '6', emoji: '🌙', category: '감성',
    title: '야경 드라이브 코스',
    desc: '도시 야경 보면서 드라이브하고 편의점 간식 타임',
    tags: ['저녁', '드라이브', '로맨틱'],
    spots: [
      { name: '야경 명소', type: '뷰' },
      { name: '편의점 간식', type: '간식' },
      { name: '전망 좋은 카페', type: '카페' },
    ]
  },
  {
    id: '7', emoji: '💰', category: '절약',
    title: '알뜰 집 데이트',
    desc: '넷플릭스 + 배달음식 + 보드게임으로 꿀잼 하루',
    tags: ['집콕', '절약', '편안'],
    spots: [
      { name: '같이 요리하기', type: '쿠킹' },
      { name: '영화/드라마 정주행', type: '영상' },
      { name: '보드게임/닌텐도', type: '게임' },
    ]
  },
  {
    id: '8', emoji: '📸', category: '야외',
    title: '사진 찍기 좋은 코스',
    desc: '인생샷 건지러 가자! 벽화마을, 식물원, 포토존',
    tags: ['포토', 'SNS', '맑은 날'],
    spots: [
      { name: '벽화마을/핫플', type: '포토' },
      { name: '식물원/수목원', type: '자연' },
      { name: '감성 카페', type: '카페' },
    ]
  },
]

export default function DateFeed() {
  const { data, updateData } = useFirebase()
  const [selectedCat, setSelectedCat] = useState<string>('전체')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const likedCourses = data.likedCourses || []
  const likedIds = new Set(likedCourses)

  const filtered = selectedCat === '전체'
    ? CURATED_COURSES
    : CURATED_COURSES.filter(c => c.category === selectedCat)

  const toggleLike = (id: string) => {
    updateData(prev => {
      const current = prev.likedCourses || []
      return {
        ...prev,
        likedCourses: current.includes(id)
          ? current.filter(c => c !== id)
          : [...current, id]
      }
    })
  }

  return (
    <div className="px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-3"
      >
        <h2 className="text-lg font-black text-gray-800">💡 데이트 코스 추천</h2>
        <p className="text-xs text-gray-400 mt-0.5">오늘은 어떤 데이트 할까?</p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3"
        style={{ maskImage: 'linear-gradient(90deg, black 90%, transparent 100%)' }}>
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className={`relative px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 transition-all duration-300
              ${selectedCat === cat
                ? 'text-white shadow-[0_4px_16px_rgba(236,72,153,0.25)]'
                : 'bg-white/70 text-gray-500 border border-white/50 backdrop-blur-sm'}`}
          >
            {selectedCat === cat && (
              <motion.div
                layoutId="cat-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((course, idx) => {
            const isExpanded = expandedId === course.id
            const isLiked = likedIds.has(course.id)
            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : course.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <motion.span
                          animate={isExpanded ? { rotate: [0, -10, 10, 0] } : {}}
                          className="text-2xl"
                        >{course.emoji}</motion.span>
                        <h3 className="text-[15px] font-extrabold text-gray-800">{course.title}</h3>
                      </div>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{course.desc}</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {course.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 text-[10px] font-bold text-primary border border-primary/10">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); toggleLike(course.id) }}
                        whileTap={{ scale: 1.3 }}
                        className={`p-2 rounded-full transition ${isLiked ? 'bg-primary/10' : 'bg-gray-50'}`}
                      >
                        <Heart size={16} className={`transition-all duration-300 ${isLiked ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                      </motion.button>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <ChevronRight size={16} className="text-gray-300" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="border-t border-gray-100/50 pt-3">
                          <div className="text-[11px] font-bold text-gray-400 mb-2">코스 순서</div>
                          <div className="space-y-2">
                            {course.spots.map((spot, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-center gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-[0_2px_8px_rgba(236,72,153,0.2)]">
                                  {i + 1}
                                </div>
                                <div className="flex-1 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/50">
                                  <span className="text-[13px] font-semibold text-gray-700">{spot.name}</span>
                                  <span className="text-[10px] font-bold gradient-text bg-gradient-to-r from-primary/5 to-secondary/5 px-2 py-0.5 rounded-full">{spot.type}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
