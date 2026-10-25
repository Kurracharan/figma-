import { eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, startOfMonth, startOfWeek } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import type { CalendarCategory, CalendarEvent } from '../types/calendar'
import { CALL_CATEGORY_COLOR, getCategoryStyle } from '../types/calendar'
import DayCell from './DayCell'
import EventBar from './EventBar'
import MoreChip from './MoreChip'

const weekdayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

interface MonthGridProps {
  month: Date
  events: CalendarEvent[]
  categories: CalendarCategory[]
  onAddAtDate: (date: Date) => void
  onSelectEvent: (event: CalendarEvent, anchor: HTMLElement) => void
}

interface EventSegment {
  event: CalendarEvent
  startColumn: number
  endColumn: number
  lane: number
}

interface MoreEventsPopoverState {
  events: CalendarEvent[]
  day: Date
  left: number
  top: number
}

function dateKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

function segmentsForWeek(week: Date[], events: CalendarEvent[]) {
  const first = week[0]
  const last = week[6]
  const relevant = events
    .filter((event) => !isBefore(new Date(`${event.end}T00:00:00`), first) && !isAfter(new Date(`${event.start}T00:00:00`), last))
    .map((event) => ({
      event,
      start: isBefore(new Date(`${event.start}T00:00:00`), first) ? first : new Date(`${event.start}T00:00:00`),
      end: isAfter(new Date(`${event.end}T00:00:00`), last) ? last : new Date(`${event.end}T00:00:00`),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime() || a.event.id.localeCompare(b.event.id))

  const dayCounts = new Map<string, number>()
  relevant.forEach(({ start, end }) => {
    eachDayOfInterval({ start, end }).forEach((day) => dayCounts.set(dateKey(day), (dayCounts.get(dateKey(day)) ?? 0) + 1))
  })

  const laneEnds: Date[] = []
  const segments: EventSegment[] = []
  relevant.forEach(({ event, start, end }) => {
    let lane = laneEnds.findIndex((laneEnd) => isBefore(laneEnd, start))
    if (lane < 0) lane = laneEnds.length
    laneEnds[lane] = end
    const startColumn = week.findIndex((day) => isSameDay(day, start)) + 1
    const endColumn = week.findIndex((day) => isSameDay(day, end)) + 1
    segments.push({ event, startColumn, endColumn, lane })
  })

  const overflowByDay = week.flatMap((day, index) => {
    const dayEvents = relevant
      .filter(({ start, end }) => !isBefore(day, start) && !isAfter(day, end))
      .map(({ event }) => event)
    return dayEvents.length > 2
      ? [{ column: index + 1, events: dayEvents.slice(1), categoryId: dayEvents[0].categoryId }]
      : []
  })
  const visible = segments.filter(({ event }) => {
    const { start, end } = relevant.find((item) => item.event.id === event.id)!
    return eachDayOfInterval({ start, end }).every((day) => {
      const dayEvents = relevant.filter((item) => !isBefore(day, item.start) && !isAfter(day, item.end))
      return dayEvents.findIndex((item) => item.event.id === event.id) < (dayEvents.length > 2 ? 1 : 2)
    })
  })

  return { segments: visible, overflowByDay, laneCount: Math.max(2, laneEnds.length) }
}

export default function MonthGrid({
  month,
  events,
  categories,
  onAddAtDate,
  onSelectEvent,
}: MonthGridProps) {
  const [moreEventsPopover, setMoreEventsPopover] = useState<MoreEventsPopoverState | null>(null)
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const colorFor = (categoryId: string) => categoryById.get(categoryId)?.color ?? CALL_CATEGORY_COLOR
  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end })
    return Array.from({ length: days.length / 7 }, (_, index) => days.slice(index * 7, index * 7 + 7))
  }, [month])

  useEffect(() => {
    if (!moreEventsPopover) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreEventsPopover(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [moreEventsPopover])

  function openMoreEvents(events: CalendarEvent[], day: Date, trigger: HTMLButtonElement) {
    const rect = trigger.getBoundingClientRect()
    const width = 236
    const estimatedHeight = 244
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
    const top = rect.bottom + estimatedHeight <= window.innerHeight - 8
      ? rect.bottom + 6
      : Math.max(8, rect.top - estimatedHeight - 6)
    setMoreEventsPopover({ events, day, left, top })
  }

  return (
    <div className="overflow-x-auto">
      <div role="grid" aria-label={`${format(month, 'MMMM yyyy')} calendar`} className="min-w-[700px] border-b border-r border-[#EDEDED]">
        <div role="row" className="grid h-9 grid-cols-7">
          {weekdayNames.map((day) => (
            <div key={day} role="columnheader" className="grid place-items-center border-b border-l border-[#EDEDED] text-[9px] font-medium tracking-[0.04em] text-[#8A8A8A]">{day}</div>
          ))}
        </div>
        {weeks.map((week) => {
          const { segments, overflowByDay } = segmentsForWeek(week, events)
          return (
            <div key={dateKey(week[0])} role="row" className="relative grid grid-cols-7">
              {week.map((day) => (
                <DayCell key={dateKey(day)} day={day} month={month} onSelect={onAddAtDate} />
              ))}
              <div className="pointer-events-none absolute inset-x-0 top-[34px] z-[2] grid grid-cols-7 auto-rows-[22px] gap-y-1">
                {segments.map(({ event, startColumn, endColumn, lane }) => (
                  <EventBar
                    key={`${event.id}-${dateKey(week[0])}`}
                    event={event}
                    onClick={onSelectEvent}
                    className="pointer-events-auto mx-1 w-[calc(100%-8px)]"
                    styleGridColumn={`${startColumn} / ${endColumn + 1}`}
                    lane={lane}
                    color={colorFor(event.categoryId)}
                  />
                ))}
                  {overflowByDay.map(({ column, events: moreEvents, categoryId }) => (
                    <MoreChip
                      key={`${column}-${moreEvents[0].id}`}
                      events={moreEvents}
                      day={week[column - 1]}
                      onClick={openMoreEvents}
                      color={colorFor(categoryId)}
                      column={column}
                    />
                  ))}
              </div>
            </div>
          )
        })}
      </div>
      {moreEventsPopover && (
        <div className="fixed inset-0 z-40" onMouseDown={() => setMoreEventsPopover(null)}>
          <section
            role="dialog"
            aria-label="More events on Thursday 16"
            className="fixed z-50 w-[236px] rounded-lg border border-[#EDEDED] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
            style={{ left: moreEventsPopover.left, top: moreEventsPopover.top }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex h-6 items-center justify-between">
              <h3 className="m-0 text-[12px] font-medium text-[#222]">Thursday {format(moreEventsPopover.day, 'd')}</h3>
              <button
                type="button"
                aria-label="Close more events"
                onClick={() => setMoreEventsPopover(null)}
                className="grid h-6 w-6 place-items-center rounded text-[18px] leading-none text-[#8A8A8A] hover:bg-[#F3F3F3]"
              >
                ×
              </button>
            </div>
            <div className="space-y-1">
              {moreEventsPopover.events.map((event) => {
                const style = getCategoryStyle(colorFor(event.categoryId))
                return (
                  <div
                    key={event.id}
                    className="flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-[4px] border-l-[3px] px-2 text-[10px] text-[#333]"
                    style={{ borderLeftColor: style.strong, backgroundColor: style.pale }}
                  >
                    <span className="min-w-0 flex-1 truncate">{event.title}</span>
                    <span className="shrink-0 text-[#444]">{event.time}</span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
