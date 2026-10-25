import type { ProductSpec } from '../types/product'

interface SpecListProps {
  specs: ProductSpec[]
}

export default function SpecList({ specs }: SpecListProps) {
  return (
    <div>
      <h3 className="mb-1 mt-0 text-[12px] font-medium text-ink">Specifications</h3>
      <dl className="m-0">
        {specs.map(({ label, value }, index) => (
          <div
            key={label}
            className={`flex min-h-[35px] items-center justify-between gap-4 ${
              index < specs.length - 1 ? 'border-b border-[#EDEDED]' : ''
            }`}
          >
            <dt className="text-[11px] text-muted">{label}</dt>
            <dd className="m-0 text-right text-[11px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
