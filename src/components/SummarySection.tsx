import { useId } from 'react'

export interface SummaryItem {
  label: string
  value?: string
}

export interface SummarySectionProps {
  title: string
  items: SummaryItem[]
  onEdit: () => void
}

export default function SummarySection({
  title,
  items,
  onEdit,
}: SummarySectionProps) {
  const headingId = useId()
  const visibleItems = items.filter((item) => item.value !== undefined && item.value !== '')

  return (
    <section aria-labelledby={headingId} className="border-b border-[#EDEDED] py-3.5 last:border-b-0">
      <div className="mb-2 flex items-center justify-between">
        <h3 id={headingId} className="m-0 text-[14px] font-medium text-[#222]">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] font-normal text-primary hover:underline focus:outline-none"
        >
          Edit
        </button>
      </div>

      <dl className="m-0 space-y-0 text-[11px] leading-[1.9]">
        {visibleItems.map(({ label, value }) => (
          <div key={label} className="flex min-w-0 text-[11px] leading-[1.9]">
            <dt className="shrink-0 text-[#8A8A8A]">{label}:</dt>
            <dd className="m-0 min-w-0 truncate pl-1 text-[#222]" title={value}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
