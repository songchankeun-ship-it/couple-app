import { motion } from 'framer-motion'
import { Heart, MessageSquare, Image, MapPin, MoreHorizontal } from 'lucide-react'
import type { TabGroup } from '../../config/spaceConfig'

interface BottomTabItem {
  id: TabGroup
  label: string
  icon: string
}

interface BottomNavProps {
  tabs: BottomTabItem[]
  active: TabGroup
  onChange: (tab: TabGroup) => void
}

const ICONS: Record<string, typeof Heart> = {
  heart: Heart,
  chat: MessageSquare,
  image: Image,
  mappin: MapPin,
  more: MoreHorizontal,
}

export default function BottomNav({ tabs, active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
      {/* Floating pill nav */}
      <div className="mx-4 mb-[calc(0.5rem+env(safe-area-inset-bottom))] rounded-2xl bg-white/95 backdrop-blur-xl border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex justify-around items-center px-2 py-1.5">
        {tabs.map(({ id, label, icon }) => {
          const Icon = ICONS[icon] || Heart
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}
                  fill={isActive && icon === 'heart' ? 'currentColor' : 'none'}
                />
              </motion.div>
              <span className={`text-[9px] tracking-tight transition-all duration-200 ${
                isActive ? 'font-bold text-primary' : 'font-medium text-text-muted'
              }`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
