import { motion } from 'framer-motion'

type Pose = 'wave' | 'love' | 'celebrate' | 'sad' | 'think' | 'sleep' | 'hug' | 'walk' | 'camera' | 'cook'
type Gender = 'boy' | 'girl'

interface CharacterProps {
  gender: Gender
  pose?: Pose
  size?: number
  className?: string
  animate?: boolean
}

// Minimalist line-art couple characters (Japanese illustration style)
function CharacterSVG({ gender, pose = 'wave', size = 80 }: { gender: Gender; pose: Pose; size: number }) {
  const isGirl = gender === 'girl'
  const skin = '#FFE4D0'
  const hair = isGirl ? '#5C3D2E' : '#3D2E1E'
  const cheek = '#FFB4B4'
  const outfit = isGirl ? '#F2A0B5' : '#A8C5E2'
  const outfitDark = isGirl ? '#D4849B' : '#7BA3C4'

  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="32" r="22" fill={skin} />

      {/* Hair */}
      {isGirl ? (
        <>
          {/* Girl hair - bob cut with bangs */}
          <path d="M28 30 Q28 10 50 8 Q72 10 72 30 Q72 22 68 18 Q62 12 50 10 Q38 12 32 18 Q28 22 28 30Z" fill={hair} />
          <path d="M30 28 Q32 20 50 18 Q68 20 70 28" stroke={hair} strokeWidth="3" fill={hair} />
          {/* Bangs */}
          <path d="M32 25 Q36 15 42 22 Q44 14 50 20 Q56 13 58 22 Q62 14 68 25" fill={hair} />
          {/* Side hair */}
          <path d="M28 30 Q26 38 27 48 Q28 50 30 48 Q29 38 30 30Z" fill={hair} />
          <path d="M72 30 Q74 38 73 48 Q72 50 70 48 Q71 38 70 30Z" fill={hair} />
          {/* Hair clip */}
          <circle cx="70" cy="24" r="3" fill="#F2A0B5" />
          <circle cx="70" cy="24" r="1.5" fill="#FFD4E0" />
        </>
      ) : (
        <>
          {/* Boy hair - short messy */}
          <path d="M28 28 Q28 8 50 6 Q72 8 72 28 Q72 20 65 14 Q55 8 50 9 Q45 8 35 14 Q28 20 28 28Z" fill={hair} />
          {/* Messy top */}
          <path d="M35 14 Q38 6 45 10 Q48 4 55 9 Q60 4 65 12" fill={hair} />
        </>
      )}

      {/* Eyes */}
      {pose === 'sleep' ? (
        <>
          <path d="M40 32 Q42 30 44 32" stroke="#5C3D2E" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M56 32 Q58 30 60 32" stroke="#5C3D2E" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : pose === 'celebrate' ? (
        <>
          <path d="M39 30 Q42 27 45 30" stroke="#5C3D2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M55 30 Q58 27 61 30" stroke="#5C3D2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          {/* Dot eyes */}
          <circle cx="42" cy="32" r="2" fill="#3D2E1E" />
          <circle cx="58" cy="32" r="2" fill="#3D2E1E" />
          {/* Eye shine */}
          <circle cx="43" cy="31" r="0.8" fill="white" />
          <circle cx="59" cy="31" r="0.8" fill="white" />
        </>
      )}

      {/* Cheeks */}
      <ellipse cx="36" cy="37" rx="4" ry="2.5" fill={cheek} opacity="0.4" />
      <ellipse cx="64" cy="37" rx="4" ry="2.5" fill={cheek} opacity="0.4" />

      {/* Mouth */}
      {pose === 'love' && <path d="M46 40 Q50 44 54 40" stroke="#E88" strokeWidth="1.5" strokeLinecap="round" fill="none" />}
      {pose === 'wave' && <path d="M46 40 Q50 43 54 40" stroke="#D4849B" strokeWidth="1.2" strokeLinecap="round" fill="none" />}
      {pose === 'celebrate' && <ellipse cx="50" cy="41" rx="4" ry="3" fill="#E88" />}
      {pose === 'sad' && <path d="M46 42 Q50 39 54 42" stroke="#999" strokeWidth="1.2" strokeLinecap="round" fill="none" />}
      {pose === 'think' && <circle cx="54" cy="41" r="2" fill="#E88" opacity="0.6" />}
      {pose === 'sleep' && <path d="M47 41 Q50 43 53 41" stroke="#D4849B" strokeWidth="1" strokeLinecap="round" fill="none" />}
      {pose === 'hug' && <path d="M45 40 Q50 45 55 40" stroke="#E88" strokeWidth="1.5" strokeLinecap="round" fill="none" />}
      {pose === 'walk' && <path d="M46 40 Q50 43 54 40" stroke="#D4849B" strokeWidth="1.2" strokeLinecap="round" fill="none" />}
      {pose === 'camera' && <path d="M47 40 Q50 42 53 40" stroke="#D4849B" strokeWidth="1.2" strokeLinecap="round" fill="none" />}
      {pose === 'cook' && <path d="M46 40 Q50 44 54 40" stroke="#E88" strokeWidth="1.5" strokeLinecap="round" fill="none" />}

      {/* Body */}
      <path d={`M35 54 Q35 50 40 48 Q45 46 50 46 Q55 46 60 48 Q65 50 65 54 L65 85 Q65 90 60 90 L40 90 Q35 90 35 85Z`} fill={outfit} />

      {/* Collar / neckline */}
      {isGirl ? (
        <path d="M43 48 Q50 52 57 48" stroke={outfitDark} strokeWidth="1" fill="none" />
      ) : (
        <>
          <path d="M47 48 L50 54 L53 48" stroke={outfitDark} strokeWidth="1" fill="none" />
          <circle cx="50" cy="55" r="1" fill={outfitDark} />
        </>
      )}

      {/* Arms based on pose */}
      {pose === 'wave' && (
        <>
          <path d="M35 56 Q28 58 24 50 Q22 46 25 44" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q72 60 74 68" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {pose === 'love' && (
        <>
          <path d="M35 56 Q28 55 26 52 Q24 48 28 46" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q72 55 74 52 Q76 48 72 46" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {pose === 'celebrate' && (
        <>
          <path d="M35 56 Q26 48 22 38 Q20 34 24 32" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q74 48 78 38 Q80 34 76 32" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {pose === 'sad' && (
        <>
          <path d="M35 56 Q30 62 32 70" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q70 62 68 70" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {pose === 'think' && (
        <>
          <path d="M35 56 Q30 60 32 66" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q70 50 68 42 Q67 38 64 36" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {pose === 'hug' && (
        <>
          <path d="M35 56 Q28 58 30 65 Q32 70 38 68" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q72 58 70 65 Q68 70 62 68" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {(pose === 'sleep' || pose === 'walk' || pose === 'camera' || pose === 'cook') && (
        <>
          <path d="M35 56 Q30 60 32 68" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M65 56 Q70 60 68 68" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Legs */}
      <path d="M42 90 L40 110 Q40 114 44 114" stroke={skin} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M58 90 L60 110 Q60 114 56 114" stroke={skin} strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Shoes */}
      <ellipse cx="44" cy="115" rx="6" ry="3" fill={isGirl ? '#F2A0B5' : '#7BA3C4'} />
      <ellipse cx="56" cy="115" rx="6" ry="3" fill={isGirl ? '#F2A0B5' : '#7BA3C4'} />

      {/* Pose-specific accessories */}
      {pose === 'love' && (
        <g>
          <path d="M46 18 Q48 14 50 18 Q52 14 54 18 Q54 22 50 25 Q46 22 46 18Z" fill="#FF6B8A" opacity="0.8" />
        </g>
      )}
      {pose === 'sleep' && (
        <g>
          <text x="70" y="20" fontSize="8" fill="#B8A9D4" fontWeight="bold">z</text>
          <text x="76" y="14" fontSize="10" fill="#B8A9D4" fontWeight="bold" opacity="0.7">z</text>
          <text x="82" y="8" fontSize="12" fill="#B8A9D4" fontWeight="bold" opacity="0.4">z</text>
        </g>
      )}
      {pose === 'camera' && (
        <rect x="58" y="60" width="16" height="12" rx="3" fill="#555" stroke="#333" strokeWidth="1" />
      )}
      {pose === 'celebrate' && (
        <>
          <text x="18" y="28" fontSize="10">✨</text>
          <text x="74" y="28" fontSize="10">🎉</text>
        </>
      )}
    </svg>
  )
}

export function Character({ gender, pose = 'wave', size = 80, className = '', animate = true }: CharacterProps) {
  if (!animate) {
    return (
      <div className={className}>
        <CharacterSVG gender={gender} pose={pose} size={size} />
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CharacterSVG gender={gender} pose={pose} size={size} />
      </motion.div>
    </motion.div>
  )
}

// Couple pair (both characters together)
interface CouplePairProps {
  pose?: Pose
  size?: number
  className?: string
  gap?: number
}

export function CouplePair({ pose = 'wave', size = 60, className = '', gap = -10 }: CouplePairProps) {
  return (
    <motion.div
      className={`flex items-end justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CharacterSVG gender="boy" pose={pose} size={size} />
      </motion.div>
      <motion.div
        style={{ marginLeft: gap }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <CharacterSVG gender="girl" pose={pose} size={size} />
      </motion.div>
    </motion.div>
  )
}

// Empty state with character and message
interface EmptyStateProps {
  pose?: Pose
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
  gender?: Gender | 'couple'
  size?: number
}

export function EmptyState({ pose = 'wave', title, subtitle, action, gender = 'couple', size = 70 }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      {gender === 'couple' ? (
        <CouplePair pose={pose} size={size} className="mb-4" />
      ) : (
        <Character gender={gender} pose={pose} size={size} className="mb-4" />
      )}
      <h3 className="text-base font-bold text-text-primary mt-2 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-text-muted mb-4 text-center px-8">{subtitle}</p>}
      {action && (
        <motion.button
          onClick={action.onClick}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-[0_2px_12px_rgba(242,160,181,0.3)]"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Character
