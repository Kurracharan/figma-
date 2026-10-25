import React, { useId } from 'react'

export interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  children: (props: {
    id: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
    className: string
  }) => React.ReactNode
}

export default function FormField({
  label,
  error,
  className = '',
  children,
}: FormFieldProps) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="mb-[6px] block text-[11px] font-normal text-[#8A8A8A]">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': errorId,
        'aria-invalid': Boolean(error),
        className: `h-[32px] w-full rounded-full border px-3 text-[12px] text-[#222] bg-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
          error ? 'border-status-red' : 'border-[#E5E5E5]'
        }`,
      })}
      {error && (
        <p id={errorId} className="mt-1 text-[11px] text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  )
}
