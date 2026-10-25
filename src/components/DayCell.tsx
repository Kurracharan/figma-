import { format, isSameDay, isSameMonth } from 'date-fns'
import { MOCK_TODAY } from '../types/calendar'

interface DayCellProps {
  day: Date
  month: Date
  onSelect: (day: Date) => void
}

export default function DayCell({ day, month, onSelect }: DayCellProps) {
  const inMonth = isSameMonth(day, month)
  const today = isSameDay(day, MOCK_TODAY)
  return (
    <div role="gridcell" aria-label={format(day, 'EEEE, MMMM d, yyyy')} className={`relative h-[94px] min-w-0 border-l border-t border-[#EDEDED] ${today ? 'bg-[#F4F8F5]' : inMonth ? 'bg-white' : 'bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(0,0,0,0.035)_6px_7px)]'}`}>
      <button
        type="button"
        aria-label={`Add event on ${format(day, 'MMMM d, yyyy')}`}
        onClick={() => onSelect(day)}
        className="absolute inset-0 z-0"
      />
      <span className={`pointer-events-none absolute right-2.5 top-2.5 z-[1] grid h-7 min-w-7 place-items-center px-1 text-[16px] font-normal ${
        today ? 'rounded-full bg-primary font-medium text-white' : inMonth ? 'text-[#444]' : 'text-[#A8A8A8]'
      }`}>
        {format(day, 'd')}
      </span>
    </div>
  )
}
