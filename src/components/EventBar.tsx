import { getCategoryStyle, type CalendarEvent } from '../types/calendar'

interface EventBarProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent, trigger: HTMLButtonElement) => void
  className?: string
  styleGridColumn?: string
  lane?: number
  color: string
}

export default function EventBar({ event, onClick, className = '', styleGridColumn, lane = 0, color }: EventBarProps) {
  const laneClass = lane === 0 ? 'grid-row-1' : 'grid-row-2'
  const style = getCategoryStyle(color)
  return (
    <button
      type="button"
      data-event-id={event.id}
      title={`${event.title} · ${event.time}`}
      onClick={(clickEvent) => onClick(event, clickEvent.currentTarget)}
      className={`z-10 flex h-[22px] min-w-0 items-center gap-2 overflow-hidden rounded-[4px] border-l-[3px] px-1 text-left text-[10px] text-[#333] ${laneClass} ${className}`}
      style={{
        gridColumn: styleGridColumn,
        borderLeftColor: style.strong,
        backgroundColor: style.pale,
      }}
    >
      <span className="min-w-0 flex-1 truncate">{event.title}</span>
      <span className="shrink-0">{event.time}</span>
    </button>
  )
}
