import { motion } from 'framer-motion'

interface SubNavProps {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}

export default function SubNav({ tabs, active, onChange }: SubNavProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
      style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 3%, black 92%, transparent 100%)' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap shrink-0 transition-colors duration-300"
        >
          {active === tab.id && (
            <motion.div
              layoutId="sub-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_4px_20px_rgba(236,72,153,0.25)]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${active === tab.id ? 'text-white' : 'text-gray-500'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
