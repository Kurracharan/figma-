import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  quantity: number
  onChange: (quantity: number) => void
}

export default function QuantityStepper({ quantity, onChange }: QuantityStepperProps) {
  return (
    <div className="flex h-8 w-[78px] items-center justify-between rounded-full border border-[#E5E5E5] px-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= 1}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="grid h-5 w-5 place-items-center text-[#8A8A8A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Minus size={12} />
      </button>
      <span aria-live="polite" className="min-w-3 text-center text-[11px] text-ink">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={quantity >= 99}
        onClick={() => onChange(Math.min(99, quantity + 1))}
        className="grid h-5 w-5 place-items-center text-[#555] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={12} />
      </button>
    </div>
  )
}
