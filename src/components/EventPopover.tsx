import { useEffect, useRef } from 'react'
import { AlignLeft, CalendarDays, Clock3, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'
import type { CalendarEvent } from '../types/calendar'

interface EventPopoverProps {
  event: CalendarEvent
  categoryName: string
  color: string
  anchor: HTMLElement
  onClose: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (event: CalendarEvent) => void
}

function eventDate(value: string) {
  return new Date(`${value}T00:00:00`)
}

export default function EventPopover({
  event,
  categoryName,
  color,
  anchor,
  onClose,
  onEdit,
  onDelete,
}: EventPopoverProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const position = (() => {
    const rect = anchor.getBoundingClientRect()
    const width = 340
    const height = 250
    const left = rect.right + width + 12 < window.innerWidth
      ? rect.right + 12
      : Math.max(12, rect.left - width - 12)
    const top = Math.max(12, Math.min(rect.top, window.innerHeight - height - 12))
    return { left, top }
  })()

  useEffect(() => {
    const previousFocus = anchor
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
    function handlePointerDown(event: PointerEvent) {
      if (!dialogRef.current?.contains(event.target as Node) && !anchor.contains(event.target as Node)) onClose()
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        previousFocus.focus()
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const buttons = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [anchor, onClose])

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-label={`${event.title} event details`}
      className="fixed z-[100] w-[min(340px,calc(100vw-24px))] rounded-calendar-card border border-calendar-border bg-white p-5 shadow-calendar-popover"
      style={{ left: position.left, top: position.top }}
    >
      <div className="mb-5 flex justify-end gap-1">
        <button type="button" aria-label="Edit event" onClick={() => onEdit(event)} className="grid h-8 w-8 place-items-center rounded-md text-calendar-muted hover:bg-calendar-surface">
          <Pencil size={15} />
        </button>
        <button type="button" aria-label="Delete event" onClick={() => onDelete(event)} className="grid h-8 w-8 place-items-center rounded-md text-calendar-muted hover:bg-calendar-surface hover:text-calendar-danger">
          <Trash2 size={15} />
        </button>
        <button type="button" aria-label="More event actions" className="grid h-8 w-8 place-items-center rounded-md text-calendar-muted hover:bg-calendar-surface">
          <MoreHorizontal size={17} />
        </button>
        <button type="button" aria-label="Close event details" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md bg-calendar-surface text-calendar-muted hover:bg-calendar-border">
          <X size={15} />
        </button>
      </div>
      <div className="space-y-4">
        <h2 className="m-0 flex items-center gap-2 text-calendar-title font-semibold leading-6 text-calendar-ink">
          <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: color }} />
          {event.title}
        </h2>
        <p className="m-0 flex items-center gap-2.5 text-calendar-body text-calendar-body-ink">
          <Clock3 size={15} className="shrink-0 text-calendar-muted" />
          <span>{format(eventDate(event.start), 'EEEE, MMMM d')} · {event.time} - {event.endTime ?? '01:30'}</span>
        </p>
        <p className="m-0 flex items-start gap-2.5 text-calendar-body leading-5 text-calendar-muted">
          <AlignLeft size={15} className="mt-0.5 shrink-0" />
          <span>{event.description || 'No description has been added for this event.'}</span>
        </p>
        <p className="m-0 flex items-center gap-2.5 text-calendar-body text-calendar-body-ink">
          <CalendarDays size={15} className="shrink-0 text-calendar-muted" />
          <span>{categoryName}</span>
        </p>
      </div>
    </section>
  )
}
