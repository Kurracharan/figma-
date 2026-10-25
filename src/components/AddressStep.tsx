import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { AddressFields } from '../types/customerForm'
import FormField from './FormField'

export interface AddressStepProps {
  value: AddressFields
  onChange: (address: AddressFields) => void
  onNext: () => void
  onPrevious: () => void
}

const countryOptions = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'China',
  'Russia',
]

export default function AddressStep({
  value,
  onChange,
  onNext,
  onPrevious,
}: AddressStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)
  const cityInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  function updateField<K extends keyof AddressFields>(field: K, val: string) {
    onChange({ ...value, [field]: val })
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleNextStep(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!value.line1.trim()) {
      nextErrors.line1 = 'Address Line 1 is required'
    }
    if (!value.city.trim()) {
      nextErrors.city = 'City is required'
    }
    if (!value.country.trim()) {
      nextErrors.country = 'Country is required'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      if (nextErrors.line1) {
        firstInputRef.current?.focus()
      } else if (nextErrors.city) {
        cityInputRef.current?.focus()
      }
      return
    }

    setErrors({})
    onNext()
  }

  return (
    <div
      role="tabpanel"
      id="step-panel-address"
      aria-labelledby="step-tab-address"
      className="p-5 text-left"
    >
      <h2 id="modal-title" className="m-0 mb-4 text-[20px] font-medium text-[#222]">
        Address
      </h2>

      <form onSubmit={handleNextStep} noValidate>
        {/* Address Line 1 */}
        <FormField label="Address Line 1" error={errors.line1}>
          {({ id, 'aria-describedby': ariaDescribedby, className }) => (
            <input
              ref={firstInputRef}
              id={id}
              type="text"
              aria-describedby={ariaDescribedby}
              value={value.line1}
              onChange={(e) => updateField('line1', e.target.value)}
              className={className}
            />
          )}
        </FormField>

        {/* Address Line 2 */}
        <FormField label="Address Line 2">
          {({ id, className }) => (
            <input
              id={id}
              type="text"
              placeholder="Optional"
              value={value.line2 || ''}
              onChange={(e) => updateField('line2', e.target.value)}
              className={className}
            />
          )}
        </FormField>

        {/* City */}
        <FormField label="City" error={errors.city}>
          {({ id, 'aria-describedby': ariaDescribedby, className }) => (
            <input
              ref={cityInputRef}
              id={id}
              type="text"
              aria-describedby={ariaDescribedby}
              value={value.city}
              onChange={(e) => updateField('city', e.target.value)}
              className={className}
            />
          )}
        </FormField>

        {/* Country */}
        <FormField label="Country" error={errors.country}>
          {({ id, 'aria-describedby': ariaDescribedby, className }) => (
            <div className="relative">
              <select
                id={id}
                aria-describedby={ariaDescribedby}
                value={value.country}
                onChange={(e) => updateField('country', e.target.value)}
                className={`${className} cursor-pointer appearance-none pr-8`}
              >
                {countryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
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

        {/* State/Region + Postcode */}
        <div className="mb-4 grid grid-cols-1 gap-3 xs:grid-cols-2">
          <FormField label="State/Region" className="mb-0">
            {({ id, className }) => (
              <input
                id={id}
                type="text"
                value={value.state}
                onChange={(e) => updateField('state', e.target.value)}
                className={className}
              />
            )}
          </FormField>

          <FormField label="Postcode" className="mb-0">
            {({ id, className }) => (
              <input
                id={id}
                type="text"
                value={value.postcode}
                onChange={(e) => updateField('postcode', e.target.value)}
                className={className}
              />
            )}
          </FormField>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 flex items-center justify-between pt-1">
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
