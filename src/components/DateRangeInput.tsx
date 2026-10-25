import { useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface DateRangeInputProps {
  dateFrom: string
  dateTo: string
  onChange: (key: 'dateFrom' | 'dateTo', value: string) => void
}

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromIsoDate(value: string): Date | null {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(value: string): string {
  const date = fromIsoDate(value)
  if (!date) return '12.07.2020'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

function DatePicker({
  value,
  onSelect,
}: {
  value: string
  onSelect: (value: string) => void
}) {
  const selectedDate = fromIsoDate(value)
  const [shownMonth, setShownMonth] = useState(() => {
    const date = selectedDate ?? new Date(2020, 6, 12)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const firstDay = shownMonth.getDay()
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(shownMonth.getFullYear(), shownMonth.getMonth(), index - firstDay + 1)
    return { date, inMonth: date.getMonth() === shownMonth.getMonth() }
  })

  return (
    <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[250px] rounded-xl border border-[#EAEAEA] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setShownMonth(new Date(shownMonth.getFullYear(), shownMonth.getMonth() - 1, 1))}
          className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-[#F5F5F5]"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-[12px] font-medium text-ink">
          {shownMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setShownMonth(new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1))}
          className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-[#F5F5F5]"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {weekdays.map((weekday) => (
          <span key={weekday} className="grid h-7 place-items-center text-[10px] text-muted">
            {weekday}
          </span>
        ))}
        {days.map(({ date, inMonth }) => {
          const isoDate = toIsoDate(date)
          const isSelected = value === isoDate
          return (
            <button
              type="button"
              key={isoDate}
              aria-label={date.toLocaleDateString('en-US', { dateStyle: 'full' })}
              aria-pressed={isSelected}
              onClick={() => onSelect(isoDate)}
              className={`mx-auto grid h-7 w-7 place-items-center rounded-full text-[10px] ${
                isSelected
                  ? 'bg-primary font-medium text-white'
                  : inMonth
                    ? 'text-ink hover:bg-pale-green'
                    : 'text-[#BDBDBD] hover:bg-pale-green'
              }`}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DateField({
  label,
  value,
  alignRight,
  onChange,
}: {
  label: string
  value: string
  alignRight: boolean
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex h-8 w-full items-center gap-1.5 rounded-lg border border-line bg-white px-2 text-[10px] text-[#555] hover:border-[#D4D4D4]"
      >
        <CalendarDays size={13} className="shrink-0 text-[#8A8A8A]" />
        <span className="min-w-0 flex-1 whitespace-nowrap text-left">{formatDate(value)}</span>
        <ChevronDown size={12} className="shrink-0 text-[#8A8A8A]" />
      </button>
      {open && (
        <div className={alignRight ? 'absolute right-0 top-0' : ''}>
          <DatePicker
            value={value}
            onSelect={(nextValue) => {
              onChange(nextValue)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default function DateRangeInput({ dateFrom, dateTo, onChange }: DateRangeInputProps) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] text-muted">Date</span>
      <div className="flex items-center gap-2">
        <DateField
          label="Date from"
          value={dateFrom}
          alignRight={false}
          onChange={(value) => onChange('dateFrom', value)}
        />
        <span className="text-[12px] text-[#999]">—</span>
        <DateField
          label="Date to"
          value={dateTo}
          alignRight
          onChange={(value) => onChange('dateTo', value)}
        />
      </div>
    </div>
  )
}
