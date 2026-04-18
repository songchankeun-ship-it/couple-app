import { useState } from 'react'
import { Heart, ChevronRight } from 'lucide-react'

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
  const [selectedCat, setSelectedCat] = useState<string>('전체')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  const filtered = selectedCat === '전체'
    ? CURATED_COURSES
    : CURATED_COURSES.filter(c => c.category === selectedCat)

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="px-4 pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="py-3">
        <h2 className="text-lg font-black text-gray-800">💡 데이트 코스 추천</h2>
        <p className="text-xs text-gray-400 mt-0.5">오늘은 어떤 데이트 할까?</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3"
        style={{ maskImage: 'linear-gradient(90deg, black 90%, transparent 100%)' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap border-[1.5px] transition-all shrink-0
              ${selectedCat === cat
                ? 'bg-teal text-white border-teal shadow-[0_4px_14px_rgba(236,72,153,0.3)]'
                : 'bg-white text-gray-500 border-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="space-y-3">
        {filtered.map(course => {
          const isExpanded = expandedId === course.id
          const isLiked = likedIds.has(course.id)
          return (
            <div key={course.id} className="glass-card overflow-hidden">
              {/* Card Header */}
              <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : course.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl">{course.emoji}</span>
                      <h3 className="text-[15px] font-extrabold text-gray-800">{course.title}</h3>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{course.desc}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {course.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[10px] font-bold text-pink-400 border border-pink-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(course.id) }}
                      className={`p-2 rounded-full transition ${isLiked ? 'bg-pink-100' : 'bg-gray-50'}`}>
                      <Heart size={16} className={isLiked ? 'text-pink-500 fill-pink-500' : 'text-gray-300'} />
                    </button>
                    <ChevronRight size={16} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expanded: Course Steps */}
              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in-up">
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-[11px] font-bold text-gray-400 mb-2">코스 순서</div>
                    <div className="space-y-2">
                      {course.spots.map((spot, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                            <span className="text-[13px] font-semibold text-gray-700">{spot.name}</span>
                            <span className="text-[10px] font-bold text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">{spot.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
