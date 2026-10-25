interface PrefixedInputProps {
  id: string
  label: string
  prefix: '$' | '%'
  value: number | null
  onChange: (value: number | null) => void
  error?: string
  formatThousands?: boolean
}

export default function PrefixedInput({
  id,
  label,
  prefix,
  value,
  onChange,
  error,
  formatThousands = false,
}: PrefixedInputProps) {
  const displayValue = value === null
    ? ''
    : formatThousands
      ? value.toLocaleString('de-DE')
      : String(value)

  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="mb-1.5 block text-[10px] text-muted">
        {label}
      </label>
      <div
        className={`flex h-8 items-center gap-2 rounded-full border bg-white px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-[#B9EE8E] ${
          error ? 'border-red-400' : 'border-[#E5E5E5]'
        }`}
      >
        <span className="text-[12px] text-[#555]">{prefix}</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            const raw = event.target.value.replace(/[^\d,.]/g, '')
            const normalized = formatThousands
              ? raw.replace(/\./g, '').replace(',', '.')
              : raw.replace(',', '.')
            onChange(normalized === '' ? null : Number(normalized))
          }}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[12px] text-ink outline-none focus:ring-0"
        />
      </div>
      {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
    </div>
  )
}
