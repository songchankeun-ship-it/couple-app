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
    <nav className="bottom-nav-glass fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-around items-center px-4 py-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))] z-50">
      {tabs.map(({ id, label, icon }) => {
        const Icon = ICONS[icon] || Heart
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center justify-center gap-1 min-w-[52px] py-1 relative"
          >
            <motion.div
              animate={{ y: isActive ? -1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.5}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`}
                fill={isActive && icon === 'heart' ? 'currentColor' : 'none'}
              />
            </motion.div>
            <span className={`text-[10px] tracking-tight transition-colors duration-200 ${
              isActive ? 'font-bold text-primary' : 'font-medium text-text-muted'
            }`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
