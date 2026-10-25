import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface DateSelectProps {
  label: string
  value: Date
  alignRight?: boolean
  onChange: (value: Date) => void
}

interface PopoverPosition {
  left: number
  top: number
  width: number
}

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function sameDate(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

export default function DateSelect({ label, value, alignRight = false, onChange }: DateSelectProps) {
  const [open, setOpen] = useState(false)
  const [shownMonth, setShownMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1))
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstWeekday = (shownMonth.getDay() + 6) % 7
  const dayCount = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: Math.ceil((firstWeekday + dayCount) / 7) * 7 }, (_, index) => {
    const date = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), index - firstWeekday + 1)
    return { date, inMonth: date.getMonth() === shownMonth.getMonth() }
  })

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [open])

  function togglePicker() {
    if (open) {
      setOpen(false)
      return
    }
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const width = Math.min(250, window.innerWidth - 32)
      const maxLeft = window.innerWidth - width - 16
      const desiredLeft = alignRight ? rect.right - width : rect.left
      const left = Math.max(16, Math.min(desiredLeft, maxLeft))
      const top = rect.bottom + 6 + 260 <= window.innerHeight - 16
        ? rect.bottom + 6
        : Math.max(16, rect.top - 266)
      setPopoverPosition({ left, top, width })
    }
    setShownMonth(new Date(value.getFullYear(), value.getMonth(), 1))
    setOpen(true)
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-[1.25]">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${label}: ${formatDate(value)}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={togglePicker}
        className="flex h-[32px] w-full min-w-0 items-center gap-[4px] rounded-r-full border-l border-gray-200 px-[6px] text-[10px] text-slate-700 outline-none focus:relative focus:z-10 focus:ring-1 focus:ring-primary min-[400px]:text-[12px]"
      >
        <span className="min-w-0 flex-1 truncate whitespace-nowrap text-left">{formatDate(value)}</span>
        <ChevronDown size={12} className="shrink-0 text-gray-400" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Choose date"
          className="fixed z-[180] rounded-[12px] border border-gray-100 bg-white p-[12px] shadow-lg"
          style={popoverPosition ?? undefined}
        >
          <div className="mb-[4px] flex h-[32px] items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setShownMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              className="grid h-[28px] w-[28px] place-items-center rounded-md text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-[12px] font-medium text-slate-800">
              {shownMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setShownMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              className="grid h-[28px] w-[28px] place-items-center rounded-md text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center">
            {weekdays.map((weekday) => (
              <span key={weekday} className="grid h-[28px] place-items-center text-[10px] text-gray-400">{weekday}</span>
            ))}
            {days.map(({ date, inMonth }) => (
              <button
                key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                type="button"
                aria-label={date.toLocaleDateString('en-US', { dateStyle: 'full' })}
                aria-pressed={sameDate(value, date)}
                onClick={() => {
                  onChange(date)
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
                className={`mx-auto grid h-[28px] w-[28px] place-items-center rounded-full text-[10px] ${
                  sameDate(value, date)
                    ? 'bg-primary font-medium text-white'
                    : inMonth
                      ? 'text-slate-700 hover:bg-green-50'
                      : 'text-gray-300 hover:bg-green-50'
                }`}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
