import { motion } from 'framer-motion'
import { Heart, MessageSquare, Image, MapPin, MoreVertical } from 'lucide-react'
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
  more: MoreVertical,
}

export default function BottomNav({ tabs, active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav-glass fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-around items-center px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50">
      {tabs.map(({ id, label, icon }) => {
        const Icon = ICONS[icon] || Heart
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 relative"
          >
            <div className="relative">
              {/* Glow behind active icon */}
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400'}`}
                />
              </motion.div>
            </div>
            <span className={`text-[10px] font-bold transition-colors duration-300 ${isActive ? 'gradient-text' : 'text-gray-400'}`}>
              {label}
            </span>
            {isActive && (
              <motion.span
                layoutId="nav-dot"
                className="absolute -bottom-0.5 w-4 h-1 rounded-full bg-gradient-to-r from-primary to-secondary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
