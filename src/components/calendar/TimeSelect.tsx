import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

interface TimeSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const times = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, '0')
  const minute = index % 2 === 0 ? '00' : '30'
  return `${hour}:${minute}`
})

export default function TimeSelect({ label, value, onChange }: TimeSelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, times.indexOf(value)))
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [open])

  useEffect(() => {
    if (!open) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const currentIndex = open ? activeIndex : Math.max(0, times.indexOf(value))
      const nextIndex = (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + times.length) % times.length
      setActiveIndex(nextIndex)
      setOpen(true)
      requestAnimationFrame(() => optionRefs.current[nextIndex]?.scrollIntoView({ block: 'nearest' }))
      return
    }

    if (event.key === 'Enter' && open) {
      event.preventDefault()
      onChange(times[activeIndex])
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-[0.9]">
      <button
        type="button"
        ref={triggerRef}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => {
          if (!current) setActiveIndex(Math.max(0, times.indexOf(value)))
          return !current
        })}
        onKeyDown={handleKeyDown}
        className={`h-[32px] w-full rounded-l-full px-[4px] text-center text-[12px] outline-none focus:relative focus:z-10 focus:ring-1 focus:ring-primary ${
          open ? 'text-primary' : 'text-slate-700'
        }`}
      >
        {value}
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={`${label} options`}
          onKeyDown={handleKeyDown}
          className="time-select-scrollbar absolute left-0 top-[calc(100%+6px)] z-[180] max-h-[190px] w-[100px] overflow-y-auto rounded-[12px] border border-gray-100 bg-white p-[6px] shadow-lg"
        >
          {times.map((time, index) => (
            <button
              ref={(element) => { optionRefs.current[index] = element }}
              key={time}
              type="button"
              role="option"
              aria-selected={time === value}
              onClick={() => {
                onChange(time)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              className={`flex h-[32px] w-full items-center gap-[4px] rounded-[8px] px-[12px] text-left text-[13px] hover:bg-gray-100 ${
                time === value ? 'text-primary' : activeIndex === index ? 'bg-gray-100 text-slate-700' : 'text-slate-700'
              }`}
            >
              <span className="grid w-[12px] shrink-0 place-items-center">
                {time === value && <Check size={12} strokeWidth={2} />}
              </span>
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
