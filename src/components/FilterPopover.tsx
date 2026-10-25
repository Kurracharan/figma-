import { useState } from 'react'
import type { ProductFilters } from '../types/product'
import { DEFAULT_PRODUCT_FILTERS } from '../utils/productFilters'
import DateRangeInput from './DateRangeInput'
import PriceRangeSlider from './PriceRangeSlider'
import Select from './Select'

interface FilterPopoverProps {
  open: boolean
  onSave: (filters: ProductFilters) => void
}

export default function FilterPopover({ open, onSave }: FilterPopoverProps) {
  const [draft, setDraft] = useState<ProductFilters>(DEFAULT_PRODUCT_FILTERS)

  if (!open) return null

  function updateDraft<Key extends keyof ProductFilters>(key: Key, value: ProductFilters[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <div
      data-filter-popover
      role="dialog"
      aria-label="Filter products"
      className="absolute right-0 top-[calc(100%+8px)] z-40 w-[260px] rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[20px] font-medium leading-7 text-ink">Filter</h2>
        <button
          type="button"
          onClick={() => setDraft(DEFAULT_PRODUCT_FILTERS)}
          className="text-[12px] text-muted hover:text-ink"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <Select
          label="Category"
          value={draft.category}
          options={['All', 'Notebook', 'Watch', 'Phone']}
          onChange={(value) => updateDraft('category', value)}
        />
        <Select
          label="Status"
          value={draft.status}
          options={['All', 'Available', 'Disabled']}
          onChange={(value) => {
            if (value === 'All' || value === 'Available' || value === 'Disabled') {
              updateDraft('status', value)
            }
          }}
        />
        <DateRangeInput
          dateFrom={draft.dateFrom}
          dateTo={draft.dateTo}
          onChange={updateDraft}
        />
        <PriceRangeSlider
          min={draft.priceMin}
          max={draft.priceMax}
          onChange={updateDraft}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="h-8 w-[72px] rounded-lg bg-primary text-[12px] font-medium text-white hover:bg-[#187926]"
        >
          Save
        </button>
      </div>
    </div>
  )
}
