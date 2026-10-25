import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import type { CalendarCategory, CalendarEvent } from '../../types/calendar'
import type { NewEvent } from '../../types/event'
import DateSelect from './DateSelect'
import TimeSelect from './TimeSelect'

interface NewEventModalProps {
  open: boolean
  initialDate: string
  categories: CalendarCategory[]
  initialEvent?: CalendarEvent
  onClose: () => void
  onCreate: (event: NewEvent) => void
  onUpdate: (id: string, event: NewEvent) => void
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function withTime(date: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
}

function isSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
}

function categoryMarkerClass(categoryId: string) {
  switch (categoryId) {
    case 'important': return 'bg-calendar-important'
    case 'meeting': return 'bg-calendar-meeting'
    case 'event': return 'bg-calendar-event'
    case 'work': return 'bg-calendar-work'
    default: return 'bg-calendar-other'
  }
}

export default function NewEventModal({
  open,
  initialDate,
  categories,
  initialEvent,
  onClose,
  onCreate,
  onUpdate,
}: NewEventModalProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? '')
  const [description, setDescription] = useState(initialEvent?.description ?? '')
  const [startDate, setStartDate] = useState(() => parseDate(initialEvent?.start ?? initialDate))
  const [endDate, setEndDate] = useState(() => parseDate(initialEvent?.end ?? initialDate))
  const [startTime, setStartTime] = useState(initialEvent?.time ?? '09:00')
  const [endTime, setEndTime] = useState(initialEvent?.endTime ?? '09:30')
  const [repeat, setRepeat] = useState(initialEvent?.repeat ?? false)
  const [category, setCategory] = useState(initialEvent?.categoryId ?? categories.find((item) => item.id === 'important')?.id ?? categories[0]?.id ?? 'other')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const categorySelectRef = useRef<HTMLDivElement>(null)
  const selectedCategory = categories.find((item) => item.id === category)
  const availableCategories = categories.filter((item) => !item.hiddenFromList)
  const titleError = submitted && !title.trim()

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => titleInputRef.current?.focus())
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!categoryOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!categorySelectRef.current?.contains(event.target as Node)) setCategoryOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [categoryOpen])

  if (!open) return null

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (!title.trim() || !selectedCategory) return

    const updatedEvent = {
      title: title.trim(),
      description: description.trim(),
      start: withTime(startDate, startTime),
      end: withTime(endDate, endTime),
      repeat,
      category,
    }
    if (initialEvent) onUpdate(initialEvent.id, updatedEvent)
    else onCreate(updatedEvent)
    onClose()
  }

  function updateStartDate(date: Date) {
    setStartDate(date)
    if (date > endDate) setEndDate(date)
    if (isSameDay(date, endDate) && startTime > endTime) setEndTime(startTime)
  }

  function updateEndDate(date: Date) {
    const nextDate = date < startDate ? startDate : date
    setEndDate(nextDate)
    if (isSameDay(nextDate, startDate) && endTime < startTime) setEndTime(startTime)
  }

  function updateStartTime(time: string) {
    setStartTime(time)
    if (isSameDay(startDate, endDate) && time > endTime) setEndTime(time)
  }

  function updateEndTime(time: string) {
    setEndTime(isSameDay(startDate, endDate) && time < startTime ? startTime : time)
  }

  const labelClass = 'mb-1.5 block text-[12px] font-normal text-gray-400'

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center overflow-y-auto bg-black/10 px-[16px] py-[20px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-event-title"
        className="my-auto w-full max-w-[310px] rounded-[16px] bg-white p-[20px] text-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
      >
        <header className="mb-[16px] flex items-center justify-between">
          <h2 id="new-event-title" className="m-0 text-[20px] font-medium leading-6 text-slate-800">{initialEvent ? 'Edit Event' : 'New Event'}</h2>
          <button
            type="button"
            aria-label="Close new event"
            onClick={onClose}
            className="grid h-[24px] w-[24px] place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X size={13} strokeWidth={1.8} />
          </button>
        </header>

        <form onSubmit={handleCreate} className="space-y-[16px]">
          <label className="block">
            <span className={labelClass}>Title</span>
            <input
              ref={titleInputRef}
              autoComplete="off"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              aria-invalid={titleError}
              aria-describedby={titleError ? 'new-event-title-error' : undefined}
              className="h-[36px] w-full rounded-full border border-gray-200 bg-white px-[16px] text-[13px] text-slate-800 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {titleError && <span id="new-event-title-error" className="mt-[4px] block text-[10px] text-red-500">Title is required.</span>}
          </label>

          <label className="block">
            <span className={labelClass}>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="h-[70px] w-full resize-y rounded-[16px] border border-gray-200 bg-white px-[16px] py-[12px] text-[13px] leading-[16px] text-slate-800 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>

          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className={`${labelClass} p-0`}>Time and Date</legend>
            <div className="grid grid-cols-[minmax(0,1fr)_12px_minmax(0,1fr)] items-center gap-[4px]">
              <div className="flex min-w-0 overflow-visible rounded-full border border-gray-200 focus-within:border-primary">
                <TimeSelect label="Start time" value={startTime} onChange={updateStartTime} />
                <DateSelect label="Start date" value={startDate} onChange={updateStartDate} />
              </div>
              <span aria-hidden="true" className="text-center text-[11px] text-gray-300">--</span>
              <div className="flex min-w-0 overflow-visible rounded-full border border-gray-200 focus-within:border-primary">
                <TimeSelect label="End time" value={endTime} onChange={updateEndTime} />
                <DateSelect label="End date" value={endDate} alignRight onChange={updateEndDate} />
              </div>
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-center gap-[8px] text-[12px] text-slate-700">
            <input
              type="checkbox"
              checked={repeat}
              onChange={(event) => setRepeat(event.target.checked)}
              className="h-[16px] w-[16px] rounded-sm accent-primary"
            />
            Repeat
          </label>

          <div>
            <span className={labelClass}>Calendar</span>
            <div ref={categorySelectRef} className="relative">
              <button
                type="button"
                aria-label="Choose calendar"
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((current) => !current)}
                className="flex h-[36px] w-full items-center rounded-full border border-gray-200 bg-white px-[12px] text-left text-[13px] text-slate-700 outline-none hover:border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <span
                  className={`mr-2 h-[10px] w-[10px] rounded-[2px] ${categoryMarkerClass(category)}`}
                  style={{ backgroundColor: selectedCategory?.color }}
                />
                <span className="min-w-0 flex-1 truncate">{selectedCategory?.name ?? 'Other'}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {categoryOpen && (
                <div
                  role="listbox"
                  aria-label="Calendar options"
                  className="absolute left-0 right-0 top-[calc(100%+5px)] z-[180] rounded-[12px] border border-gray-100 bg-white p-[6px] shadow-lg"
                >
                  {availableCategories.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={category === option.id}
                      onClick={() => {
                        setCategory(option.id)
                        setCategoryOpen(false)
                      }}
                      className="flex h-[32px] w-full items-center gap-[8px] rounded-[8px] px-[8px] text-left text-[12px] text-slate-700 hover:bg-gray-100"
                    >
                      <span
                        className={`h-[10px] w-[10px] rounded-[2px] ${categoryMarkerClass(option.id)}`}
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="flex-1">{option.name}</span>
                      {category === option.id && <Check size={13} className="text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-[4px]">
            <button
              type="submit"
              className="h-[36px] rounded-[8px] bg-primary px-[24px] text-[13px] font-medium text-white shadow-[0_2px_3px_rgba(0,0,0,0.12)] hover:bg-green-700"
            >
              {initialEvent ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
