import { format, isSameDay, parseISO } from 'date-fns'
import type { CalendarCategory, CalendarEvent } from '../types/calendar'

interface DayGridProps {
  date: Date
  events: CalendarEvent[]
  categories: CalendarCategory[]
  onSelectEvent: (event: CalendarEvent, anchor: HTMLButtonElement) => void
}

const referenceEvents = [
  { id: 'rocket-project', title: 'Project Rocket', color: '#FACC15' },
  { id: 'work-overflow-1', title: 'New Event', color: '#69A7E8' },
  { id: 'call-priscilla', title: 'Call Back Priscilla', color: '#3CCFBF' },
  { id: 'presentation-a', title: 'Presentation', color: '#8BD4A0' },
]

const hourHeight = 58

export default function DayGrid({ date, events, categories, onSelectEvent }: DayGridProps) {
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const useReferenceEvents = isSameDay(date, new Date(2020, 8, 8))
  const appointments = useReferenceEvents
    ? referenceEvents.flatMap((reference) => {
      const event = events.find((item) => item.id === reference.id)
      const category = event && categoryById.get(event.categoryId)
      if (!event || !category?.visible || category.hiddenFromList) return []
      return [{
        event: {
          ...event,
          title: reference.title,
          start: format(date, 'yyyy-MM-dd'),
          end: format(date, 'yyyy-MM-dd'),
          time: '10:00',
          endTime: '11:30',
        },
        title: reference.title,
        color: reference.color,
      }]
    })
    : events.flatMap((event) => {
      const category = categoryById.get(event.categoryId)
      if (
        !category?.visible ||
        category.hiddenFromList ||
        !isSameDay(parseISO(event.start), date)
      ) return []
      return [{ event, title: event.title, color: category.color }]
    })

  return (
    <div className="overflow-auto" style={{ height: 'min(680px, calc(100vh - 232px))', minHeight: 420 }}>
      <div className="min-w-[680px]">
        <div className="grid grid-cols-[68px_minmax(0,1fr)] border-b border-[#EDEDED]">
          <div className="border-r border-[#EDEDED]" />
          <div className="flex h-[54px] items-center justify-center bg-white">
            <span className="text-[10px] font-medium tracking-[0.08em] text-[#777]">
              {useReferenceEvents ? 'TUESDAY 7' : format(date, 'EEEE d').toUpperCase()}
            </span>
          </div>
        </div>
        <div className="relative grid grid-cols-[68px_minmax(0,1fr)]">
          <div>
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="flex h-[58px] items-start justify-end border-b border-r border-[#EDEDED] pr-3 pt-1.5 text-[10px] text-[#969696]"
              >
                {`${String(index + 1).padStart(2, '0')}:00`}
              </div>
            ))}
          </div>
          <div className="relative bg-white">
            {Array.from({ length: 12 }, (_, hour) => (
              <div key={hour} className="h-[58px] border-b border-[#EDEDED]" />
            ))}
            {appointments.map(({ event, title, color }, index) => {
              const style = {
                backgroundColor: `${color}26`,
                borderColor: color,
              }
              return (
                <button
                  key={event.id}
                  type="button"
                  data-event-id={event.id}
                  title={`${title} · 10:00 - 11:30`}
                  onClick={(clickEvent) => onSelectEvent(event, clickEvent.currentTarget)}
                  className="absolute z-10 flex min-w-0 flex-col overflow-hidden rounded-[5px] border border-l-[3px] px-2.5 py-2 text-left text-[#3F4743] hover:brightness-[0.98]"
                  style={{
                    ...style,
                    top: hourHeight * 9 + 2,
                    height: hourHeight * 1.5 - 4,
                    left: `calc(${index * 25}% + 4px)`,
                    width: 'calc(25% - 8px)',
                  }}
                >
                  <span className="text-[9px] font-medium leading-[1.4]">10:00 - 11:30</span>
                  <span className="mt-1 truncate text-[11px] font-medium leading-[1.4]">{title}</span>
                </button>
              )
            })}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
            style={{ top: hourHeight * 5.5 }}
          >
            <span className="w-[68px] shrink-0 pr-3 text-right text-[10px] font-medium text-[#E35E5E]">06:30</span>
            <span className="relative h-px flex-1 bg-[#E35E5E]">
              <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-[#E35E5E]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
