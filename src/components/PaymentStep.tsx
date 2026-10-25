import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import FormField from './FormField'

export interface PaymentStepProps {
  value: string
  onChange: (method: string) => void
  onNext: () => void
  onPrevious: () => void
}

const paymentOptions = ['Credit Card', 'PayPal', 'Payoneer']

export default function PaymentStep({
  value,
  onChange,
  onNext,
  onPrevious,
}: PaymentStepProps) {
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  function handleNext(event: React.FormEvent) {
    event.preventDefault()
    onNext()
  }

  return (
    <div
      role="tabpanel"
      id="step-panel-payment"
      aria-labelledby="step-tab-payment"
      className="p-5 text-left"
    >
      <h2 id="modal-title" className="m-0 mb-4 text-[20px] font-medium text-[#222]">
        Payment
      </h2>

      <form onSubmit={handleNext}>
        <FormField label="Payment Method">
          {({ id, className }) => (
            <div className="relative">
              <select
                ref={selectRef}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${className} cursor-pointer appearance-none pr-8`}
              >
                {paymentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
              />
            </div>
          )}
        </FormField>

        <div className="mt-8 flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onPrevious}
            className="h-[32px] w-[80px] rounded-full border border-[#E5E5E5] bg-white text-[12px] font-medium text-[#333] hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
          >
            Previous
          </button>
          <button
            type="submit"
            className="h-[32px] w-[80px] rounded-[6px] bg-primary text-[12px] font-medium text-white hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  )
}
