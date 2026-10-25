import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import type { CalendarView } from '../types/calendar'
import ViewSwitcher from './ViewSwitcher'

interface CalendarToolbarProps {
  month: Date
  view: CalendarView
  onMonthChange: (delta: number) => void
  onToday: () => void
  onViewChange: (view: CalendarView) => void
}

export default function CalendarToolbar({ month, view, onMonthChange, onToday, onViewChange }: CalendarToolbarProps) {
  const period = view === 'Month' ? 'month' : view === 'Week' ? 'week' : 'day'
  return (
    <div className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#EDEDED] px-4 py-3 max-sm:grid-cols-[1fr_auto]">
      <div className="flex items-center gap-3">
        <div className="flex h-8 items-center overflow-hidden rounded-full border border-[#E5E5E5]">
          <button type="button" aria-label={`Previous ${period}`} onClick={() => onMonthChange(-1)} className="grid h-8 w-8 place-items-center text-[#444] hover:bg-[#F5F5F5]">
            <ChevronLeft size={14} />
          </button>
          <span className="h-4 border-l border-[#E5E5E5]" />
          <button type="button" aria-label={`Next ${period}`} onClick={() => onMonthChange(1)} className="grid h-8 w-8 place-items-center text-[#444] hover:bg-[#F5F5F5]">
            <ChevronRight size={14} />
          </button>
        </div>
        <button type="button" onClick={onToday} className="h-8 rounded-full bg-[#F3F3F3] px-4 text-[12px] text-[#333] hover:bg-[#EAEAEA]">Today</button>
      </div>
      <div className="flex items-baseline gap-1.5">
        <h2 className="m-0 text-[16px] font-medium text-[#222]">{format(month, 'MMMM')}</h2>
        <span className="text-[11px] text-[#8A8A8A]">{format(month, 'yyyy')}</span>
      </div>
      <div className="justify-self-end max-sm:col-span-2 max-sm:justify-self-center">
        <ViewSwitcher value={view} onChange={onViewChange} />
      </div>
    </div>
  )
}
