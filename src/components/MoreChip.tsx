import { getCategoryStyle, type CalendarEvent } from '../types/calendar'

interface MoreChipProps {
  events: CalendarEvent[]
  day: Date
  onClick: (events: CalendarEvent[], day: Date, trigger: HTMLButtonElement) => void
  color: string
  column: number
}

export default function MoreChip({ events, day, onClick, color, column }: MoreChipProps) {
  const style = getCategoryStyle(color)
  return (
    <button
      type="button"
      onClick={(event) => onClick(events, day, event.currentTarget)}
      aria-label={`Show ${events.length} more events`}
      className="pointer-events-auto grid-row-2 h-[22px] w-[calc(100%-8px)] justify-self-center rounded-[4px] px-1.5 text-[10px] text-[#444]"
      style={{ gridColumn: `${column}`, backgroundColor: style.pale }}
    >
      +{events.length}
    </button>
  )
}
