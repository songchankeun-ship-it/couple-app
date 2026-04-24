import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SubNavProps {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}

export default function SubNav({ tabs, active, onChange }: SubNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToActive = useCallback(() => {
    if (!scrollRef.current) return
    const activeBtn = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement
    if (activeBtn) {
      const container = scrollRef.current
      const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToActive()
  }, [active, scrollToActive])

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 px-4 py-2 overflow-x-auto"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          data-active={active === tab.id}
          onClick={() => onChange(tab.id)}
          className="relative px-4 py-2 rounded-full text-[12px] whitespace-nowrap shrink-0 transition-colors duration-200 min-h-[34px]"
        >
          {active === tab.id && (
            <motion.div
              layoutId="sub-pill"
              className="absolute inset-0 rounded-full bg-text-primary"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${
            active === tab.id
              ? 'font-bold text-white'
              : 'font-medium text-text-muted'
          }`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
