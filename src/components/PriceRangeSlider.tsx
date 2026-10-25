import type { ChangeEvent } from 'react'
import { PRICE_MAX, PRICE_MIN } from '../utils/productFilters'

interface PriceRangeSliderProps {
  min: number
  max: number
  onChange: (key: 'priceMin' | 'priceMax', value: number) => void
}

export default function PriceRangeSlider({ min, max, onChange }: PriceRangeSliderProps) {
  const start = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const end = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const rangeStyle = {
    left: `${start}%`,
    width: `${end - start}%`,
  }

  function changeMin(event: ChangeEvent<HTMLInputElement>) {
    onChange('priceMin', Math.min(Number(event.target.value), max - 50))
  }

  function changeMax(event: ChangeEvent<HTMLInputElement>) {
    onChange('priceMax', Math.max(Number(event.target.value), min + 50))
  }

  return (
    <div>
      <span className="mb-3 block text-[11px] text-muted">Price</span>
      <div className="relative mx-2 h-4">
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E7E7E7]" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary"
          style={rangeStyle}
        />
        <input
          aria-label="Minimum price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={min}
          onChange={changeMin}
          className="price-range-input pointer-events-none absolute inset-0 z-10 h-4 w-full cursor-pointer appearance-none bg-transparent"
        />
        <input
          aria-label="Maximum price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={max}
          onChange={changeMax}
          className="price-range-input pointer-events-none absolute inset-0 z-20 h-4 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-[#777]">
        <span>${min.toLocaleString('en-US')}</span>
        <span>${max.toLocaleString('en-US')}</span>
      </div>
    </div>
  )
}
