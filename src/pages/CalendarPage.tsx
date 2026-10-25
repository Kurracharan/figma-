import { useCallback, useMemo, useState } from 'react'
import { addDays, addMonths, addWeeks, format } from 'date-fns'
import { Plus } from 'lucide-react'
import DeleteEventDialog from '../components/DeleteEventDialog'
import EventPopover from '../components/EventPopover'
import NewEventModal from '../components/calendar/NewEventModal'
import CalendarToolbar from '../components/CalendarToolbar'
import Header from '../components/Header'
import DayGrid from '../components/DayGrid'
import MonthGrid from '../components/MonthGrid'
import Sidebar from '../components/Sidebar'
import WeekGrid from '../components/WeekGrid'
import { INITIAL_CALENDAR_CATEGORIES, MOCK_TODAY, initialCalendarEvents, type CalendarEvent, type CalendarView } from '../types/calendar'
import type { NewEvent } from '../types/event'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(MOCK_TODAY)
  const [view, setView] = useState<CalendarView>('Day')
  const [events, setEvents] = useState<CalendarEvent[]>(initialCalendarEvents)
  const [categories, setCategories] = useState(INITIAL_CALENDAR_CATEGORIES)
  const [addOpen, setAddOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<{ event: CalendarEvent; anchor: HTMLElement } | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [eventDate, setEventDate] = useState(format(MOCK_TODAY, 'yyyy-MM-dd'))

  const toggleCategory = useCallback((categoryId: string) => {
    setCategories((current) => current.map((category) =>
      category.id === categoryId ? { ...category, visible: !category.visible } : category,
    ))
  }, [])

  const visibleEvents = useMemo(
    () => events.filter((event) => {
      const category = categories.find((item) => item.id === event.categoryId)
      return category?.visible === true && category.hiddenFromList === false
    }),
    [categories, events],
  )

  function displayCalendarOnly(categoryId: string) {
    setCategories((current) => current.map((category) => ({
      ...category,
      visible: category.id === categoryId,
    })))
  }

  function hideCalendar(categoryId: string) {
    setCategories((current) => current.map((category) =>
      category.id === categoryId ? { ...category, hiddenFromList: true, visible: false } : category,
    ))
  }

  function restoreHiddenCalendars() {
    setCategories((current) => current.map((category) =>
      category.hiddenFromList ? { ...category, hiddenFromList: false, visible: true } : category,
    ))
  }

  function deleteCalendar(categoryId: string) {
    setCategories((current) => current.filter((category) => category.id !== categoryId))
    setEvents((current) => current.filter((event) => event.categoryId !== categoryId))
  }

  function renameCalendar(categoryId: string, name: string) {
    setCategories((current) => current.map((category) =>
      category.id === categoryId ? { ...category, name } : category,
    ))
  }

  function changeCalendarColor(categoryId: string, color: string) {
    setCategories((current) => current.map((category) =>
      category.id === categoryId ? { ...category, color } : category,
    ))
  }

  function openAddEvent(date: Date) {
    setEventDate(format(date, 'yyyy-MM-dd'))
    setEditingEvent(null)
    setAddOpen(true)
  }

  function moveDate(delta: number) {
    setCurrentDate((date) => view === 'Month'
      ? addMonths(date, delta)
      : view === 'Week' ? addWeeks(date, delta) : addDays(date, delta))
  }

  function saveEvent(event: NewEvent) {
    setEvents((current) => [...current, {
      id: `event-${Date.now()}`,
      title: event.title,
      description: event.description,
      start: format(event.start, 'yyyy-MM-dd'),
      end: format(event.end, 'yyyy-MM-dd'),
      time: format(event.start, 'HH:mm'),
      endTime: format(event.end, 'HH:mm'),
      categoryId: event.category,
      allDay: false,
      repeat: event.repeat,
    }])
  }

  function updateEvent(id: string, event: NewEvent) {
    setEvents((current) => current.map((item) => item.id === id ? {
      ...item,
      title: event.title,
      description: event.description,
      start: format(event.start, 'yyyy-MM-dd'),
      end: format(event.end, 'yyyy-MM-dd'),
      time: format(event.start, 'HH:mm'),
      endTime: format(event.end, 'HH:mm'),
      categoryId: event.category,
      repeat: event.repeat,
    } : item))
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar
        calendarActive
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        calendars={categories}
        onToggleCalendar={toggleCategory}
        onDisplayCalendarOnly={displayCalendarOnly}
        onHideCalendar={hideCalendar}
        onRestoreHiddenCalendars={restoreHiddenCalendars}
        onRenameCalendar={renameCalendar}
        onCalendarColorChange={changeCalendarColor}
        onDeleteCalendar={deleteCalendar}
        calendarEventCount={(categoryId) => events.filter((event) => event.categoryId === categoryId).length}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen((open) => !open)} usePhotoAvatar />
        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="m-0 text-[20px] font-medium leading-tight text-ink">Calendar</h1>
            <button
              type="button"
              onClick={() => openAddEvent(currentDate)}
              className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-calendar-body font-medium text-white hover:bg-[#187926]"
            >
              <Plus size={13} />
              Add Event
            </button>
          </div>

          <section className="overflow-hidden rounded-xl border border-calendar-border bg-white shadow-calendar-card">
            <CalendarToolbar
              month={currentDate}
              view={view}
              onMonthChange={moveDate}
              onToday={() => setCurrentDate(MOCK_TODAY)}
              onViewChange={setView}
            />
            {view === 'Month' ? (
              <MonthGrid
                month={currentDate}
                events={visibleEvents}
                categories={categories}
                onAddAtDate={openAddEvent}
                onSelectEvent={(event, anchor) => setSelectedEvent({ event, anchor })}
              />
            ) : view === 'Week' ? (
              <WeekGrid
                date={currentDate}
                events={visibleEvents}
                categories={categories}
                onSelectEvent={(event, anchor) => setSelectedEvent({ event, anchor })}
              />
            ) : (
              <DayGrid
                date={currentDate}
                events={visibleEvents}
                categories={categories}
                onSelectEvent={(event, anchor) => setSelectedEvent({ event, anchor })}
              />
            )}
          </section>
        </main>
      </div>
      {selectedEvent && (
        <EventPopover
          event={selectedEvent.event}
          categoryName={categories.find((item) => item.id === selectedEvent.event.categoryId)?.name ?? 'Other'}
          color={categories.find((item) => item.id === selectedEvent.event.categoryId)?.color ?? '#6B7280'}
          anchor={selectedEvent.anchor}
          onClose={() => setSelectedEvent(null)}
          onDelete={setDeletingEvent}
          onEdit={(event) => {
            setEventDate(event.start)
            setEditingEvent(event)
            setSelectedEvent(null)
            setAddOpen(true)
          }}
        />
      )}
      {deletingEvent && (
        <DeleteEventDialog
          onCancel={() => setDeletingEvent(null)}
          onConfirm={() => {
            setEvents((current) => current.filter((item) => item.id !== deletingEvent.id))
            setSelectedEvent(null)
            setDeletingEvent(null)
          }}
        />
      )}
      {addOpen && (
        <NewEventModal
          key={editingEvent?.id ?? 'new-event'}
          open
          initialDate={eventDate}
          categories={categories}
          initialEvent={editingEvent ?? undefined}
          onClose={() => {
            setAddOpen(false)
            setEditingEvent(null)
          }}
          onCreate={saveEvent}
          onUpdate={updateEvent}
        />
      )}
    </div>
  )
}
