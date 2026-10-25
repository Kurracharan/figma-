import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import FormField from './FormField'

export interface ProfileStepValues {
  name: string
  email: string
  phone: string
  status: 'Active' | 'Blocked'
}

export interface ProfileStepProps {
  value: ProfileStepValues
  onChange: (values: ProfileStepValues) => void
  onNext: () => void
}

export default function ProfileStep({
  value,
  onChange,
  onNext,
}: ProfileStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  function updateField<K extends keyof ProfileStepValues>(field: K, val: ProfileStepValues[K]) {
    onChange({ ...value, [field]: val })
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleNext(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!value.name.trim()) {
      nextErrors.name = 'Full name is required'
    }
    if (!value.email.trim()) {
      nextErrors.email = 'Email is required'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      if (nextErrors.name) nameInputRef.current?.focus()
      else if (nextErrors.email) emailInputRef.current?.focus()
      return
    }

    setErrors({})
    onNext()
  }

  return (
    <div
      role="tabpanel"
      id="step-panel-profile"
      aria-labelledby="step-tab-profile"
      className="p-5 text-left"
    >
      <h2 id="modal-title" className="m-0 mb-4 text-[20px] font-medium text-[#222]">
        Profile
      </h2>

      <form onSubmit={handleNext} noValidate>
        <FormField label="Full Name" error={errors.name}>
          {({ id, 'aria-describedby': ariaDescribedby, className }) => (
            <input
              ref={nameInputRef}
              id={id}
              type="text"
              aria-describedby={ariaDescribedby}
              value={value.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={className}
            />
          )}
        </FormField>

        <FormField label="Email" error={errors.email}>
          {({ id, 'aria-describedby': ariaDescribedby, className }) => (
            <input
              ref={emailInputRef}
              id={id}
              type="email"
              aria-describedby={ariaDescribedby}
              value={value.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={className}
            />
          )}
        </FormField>

        <FormField label="Phone">
          {({ id, className }) => (
            <input
              id={id}
              type="tel"
              value={value.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={className}
            />
          )}
        </FormField>

        <FormField label="Status">
          {({ id, className }) => (
            <div className="relative">
              <select
                id={id}
                value={value.status}
                onChange={(e) => updateField('status', e.target.value as 'Active' | 'Blocked')}
                className={`${className} cursor-pointer appearance-none pr-8`}
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
              />
            </div>
          )}
        </FormField>

        <div className="mt-5 flex items-center justify-end pt-1">
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

