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
    <nav className="bottom-nav-glass fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-around items-center px-1 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50 border-t border-teal/5">
      {tabs.map(({ id, label, icon }) => {
        const Icon = ICONS[icon] || Heart
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 text-[9px] font-bold transition-all duration-300 relative
              ${active === id ? 'text-teal' : 'text-gray-400'}`}
          >
            <Icon
              size={22}
              strokeWidth={active === id ? 2.5 : 1.8}
              className={`transition-all duration-300 ${active === id ? 'scale-110' : ''}`}
            />
            <span>{label}</span>
            {active === id && (
              <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-teal shadow-[0_0_6px_rgba(56,178,172,0.4)]" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
