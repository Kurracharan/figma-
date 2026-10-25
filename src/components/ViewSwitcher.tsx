import type { CalendarView } from '../types/calendar'

interface ViewSwitcherProps {
  value: CalendarView
  onChange: (view: CalendarView) => void
}

export default function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex h-8 items-center rounded-full border border-[#E5E5E5] p-0.5" aria-label="Calendar view">
      {(['Month', 'Week', 'Day'] as CalendarView[]).map((view) => (
        <button
          key={view}
          type="button"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={`h-7 rounded-full px-3 text-[11px] ${value === view ? 'bg-primary font-medium text-white' : 'text-[#333] hover:bg-[#F4F4F4]'}`}
        >
          {view}
        </button>
      ))}
    </div>
  )
}
