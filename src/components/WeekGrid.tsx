import { addDays, differenceInCalendarDays, format, isSameDay, startOfWeek } from 'date-fns'
import type { CalendarCategory, CalendarEvent } from '../types/calendar'
import { getCategoryStyle, MOCK_TODAY } from '../types/calendar'

interface WeekGridProps {
  date: Date
  events: CalendarEvent[]
  categories: CalendarCategory[]
  onSelectEvent: (event: CalendarEvent, anchor: HTMLButtonElement) => void
}

interface WeekAppointment {
  event: CalendarEvent
  day: number
  top: number
  height: number
}

const hourHeight = 42
const referenceAppointments = [
  { eventId: 'meeting-judith', day: 1 },
  { eventId: 'work-overflow-1', day: 1 },
  { eventId: 'rocket-project', day: 2 },
  { eventId: 'call-priscilla', day: 3 },
  { eventId: 'presentation-a', day: 4 },
  { eventId: 'presentation-b', day: 4 },
]

const referenceWeekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function WeekEventButton({
  event,
  color,
  referenceWeek,
  onSelectEvent,
  className,
}: {
  event: CalendarEvent
  color: string
  referenceWeek: boolean
  onSelectEvent: WeekGridProps['onSelectEvent']
  className: string
}) {
  const style = getCategoryStyle(color)
  const title = event.title === 'Meeting with Judith' && referenceWeek ? 'Meeting with...' : event.title
  return (
    <button
      type="button"
      data-event-id={event.id}
      title={`${event.title} · ${referenceWeek ? '10:00 - 11:30' : `${event.time} - ${event.endTime ?? event.time}`}`}
      onClick={(clickEvent) => onSelectEvent(event, clickEvent.currentTarget)}
      className={`flex min-w-0 flex-col overflow-hidden rounded-[4px] border-l-[3px] px-1.5 py-1 text-left text-[9px] leading-[1.35] text-[#3F4743] hover:brightness-[0.98] ${className}`}
      style={{ borderLeftColor: style.strong, backgroundColor: style.pale }}
    >
      <span className="shrink-0 whitespace-nowrap text-[8px] font-medium tracking-[-0.02em]">
        {referenceWeek ? '10:00 - 11:30' : `${event.time} - ${event.endTime ?? event.time}`}
      </span>
      <span className="truncate">{title}</span>
    </button>
  )
}

export default function WeekGrid({ date, events, categories, onSelectEvent }: WeekGridProps) {
  const referenceWeek = isSameDay(date, MOCK_TODAY)
  const weekStart = referenceWeek
    ? addDays(startOfWeek(date, { weekStartsOn: 1 }), -1)
    : startOfWeek(date, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const eventById = new Map(events.map((event) => [event.id, event]))
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const selectedDayIndex = days.findIndex((day) => isSameDay(day, date))
  const referenceEventIds = new Set(referenceAppointments.map(({ eventId }) => eventId))
  const displayedAppointments: WeekAppointment[] = referenceWeek
    ? [
      ...referenceAppointments.flatMap(({ eventId, day }) => {
      const event = eventById.get(eventId)
      if (!event) return []
      const displayDate = format(days[day], 'yyyy-MM-dd')
      return [{
        event: { ...event, start: displayDate, end: displayDate, time: '10:00', endTime: '11:30' },
        day,
        top: hourHeight * 9 + 2,
        height: hourHeight * 1.5 - 4,
      }]
      }),
      ...events.flatMap((event) => {
        if (referenceEventIds.has(event.id) || !event.id.startsWith('event-')) return []
        const eventDay = differenceInCalendarDays(new Date(`${event.start}T00:00:00`), weekStart)
        if (eventDay < 0 || eventDay > 6) return []
        const [hours, minutes] = event.time.split(':').map(Number)
        const [endHours, endMinutes] = (event.endTime ?? event.time).split(':').map(Number)
        const startPosition = ((hours - 1) + minutes / 60) * hourHeight
        const duration = Math.max(0.5, endHours + endMinutes / 60 - hours - minutes / 60)
        return [{
          event,
          day: eventDay,
          top: startPosition + 2,
          height: Math.max(26, duration * hourHeight - 4),
        }]
      }),
    ]
    : events.flatMap((event) => {
      const eventDay = differenceInCalendarDays(new Date(`${event.start}T00:00:00`), weekStart)
      if (eventDay < 0 || eventDay > 6) return []
      const [hours, minutes] = event.time.split(':').map(Number)
      const [endHours, endMinutes] = (event.endTime ?? event.time).split(':').map(Number)
      const startPosition = ((hours - 1) + minutes / 60) * hourHeight
      const duration = Math.max(0.5, endHours + endMinutes / 60 - hours - minutes / 60)
      return [{
        event,
        day: eventDay,
        top: startPosition + 2,
        height: Math.max(26, duration * hourHeight - 4),
      }]
    })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-[#EDEDED]">
          <div className="border-r border-[#EDEDED]" />
          {days.map((day, index) => (
            <div
              key={day.toISOString()}
              className={`flex h-[62px] flex-col items-center justify-center gap-1 border-r border-[#EDEDED] last:border-r-0 ${
                index === selectedDayIndex ? 'bg-[#F7FAF7]' : 'bg-white'
              }`}
            >
              <span className="text-[9px] font-medium tracking-[0.045em] text-[#8A8A8A]">
                {referenceWeek ? referenceWeekdays[index] : format(day, 'EEEE').toUpperCase()}
              </span>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-[14px] ${
                index === selectedDayIndex ? 'bg-primary font-medium text-white' : 'text-[#444]'
              }`}>
                {format(day, 'd')}
              </span>
            </div>
          ))}
        </div>
        <div className="relative grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
          <div>
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="flex h-[42px] items-start justify-end border-b border-r border-[#EDEDED] pr-2 pt-1.5 text-[10px] text-[#969696]"
              >
                {`${String(index + 1).padStart(2, '0')}:00`}
              </div>
            ))}
          </div>
          {days.map((day, index) => (
            <div key={day.toISOString()} className={`relative ${
              index === selectedDayIndex ? 'bg-[#FBFCFB]' : 'bg-white'
            }`}>
              {Array.from({ length: 12 }, (_, hour) => (
                <div key={hour} className="h-[42px] border-b border-r border-[#EDEDED] last:border-r-0" />
              ))}
            </div>
          ))}
          <div className="pointer-events-none absolute inset-y-0 left-[56px] right-0 grid grid-cols-7">
            {days.map((day, dayIndex) => {
                const dayAppointments = displayedAppointments.filter((appointment) => {
                  const category = categoryById.get(appointment.event.categoryId)
                  return appointment.day === dayIndex && category?.visible === true && category.hiddenFromList === false
                })

                return (
                  <div key={day.toISOString()} className="relative">
                      {referenceWeek && dayAppointments.length > 1 ? (
                        <div
                          className="pointer-events-auto absolute left-1 right-1 flex gap-1"
                          style={{ top: hourHeight * 9 + 2, height: hourHeight * 1.5 - 4 }}
                        >
                          {dayAppointments.map(({ event }) => (
                            <WeekEventButton
                              key={event.id}
                              event={event}
                              color={categoryById.get(event.categoryId)?.color ?? '#6B7280'}
                              referenceWeek
                              onSelectEvent={onSelectEvent}
                              className="h-full flex-1"
                            />
                          ))}
                        </div>
                      ) : dayAppointments.map(({ event, top, height }) => (
                        <div
                          key={event.id}
                          className="pointer-events-auto absolute left-1 right-1"
                          style={{ top, height }}
                        >
                          <WeekEventButton
                            event={event}
                            color={categoryById.get(event.categoryId)?.color ?? '#6B7280'}
                            referenceWeek={referenceWeek}
                            onSelectEvent={onSelectEvent}
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                  </div>
                )
            })}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
            style={{ top: hourHeight * 5.5 }}
          >
            <span className="w-[56px] shrink-0 pr-2 text-right text-[10px] font-medium text-[#E35E5E]">06:30</span>
            <span className="relative h-px flex-1 bg-[#E35E5E]">
              <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-[#E35E5E]" />
            </span>
          </div>
          <span className="sr-only">Selected week of {format(date, 'MMMM d')}</span>
        </div>
      </div>
    </div>
  )
}
