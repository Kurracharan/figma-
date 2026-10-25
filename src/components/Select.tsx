import { ChevronDown } from 'lucide-react'

interface SelectProps {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  id?: string
  error?: string
  compact?: boolean
}

export default function Select({
  label,
  value,
  options,
  onChange,
  id: customId,
  error,
  compact = false,
}: SelectProps) {
  const id = customId ?? `filter-${label.toLowerCase()}`

  return (
    <div>
      <label htmlFor={id} className={compact ? 'sr-only' : 'mb-1.5 block text-[11px] text-muted'}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`${compact ? 'h-[30px] rounded-full pl-3 pr-8 text-[11px]' : 'h-8 rounded-lg px-3 pr-8 text-[12px]'} w-full appearance-none border bg-white text-ink outline-none focus:border-primary focus:ring-1 focus:ring-[#B9EE8E] ${
            error ? 'border-red-400' : 'border-line'
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={compact ? 12 : 14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777]"
        />
      </div>
      {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
    </div>
  )
}
