import { useEffect, useRef } from 'react'
import type { NewCustomerForm } from '../types/customerForm'

export interface SubmissionStepProps {
  form: NewCustomerForm
  onSubmit: () => void
  onPrevious: () => void
}

export default function SubmissionStep({
  form,
  onSubmit,
  onPrevious,
}: SubmissionStepProps) {
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    submitButtonRef.current?.focus()
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div
      role="tabpanel"
      id="step-panel-submission"
      aria-labelledby="step-tab-submission"
      className="p-5 text-left"
    >
      <h2 id="modal-title" className="m-0 mb-4 text-[20px] font-medium text-[#222]">
        Submission
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded-lg border border-[#EDEDED] bg-[#F9F9F9] p-3 text-[11px] text-[#333] space-y-1.5">
          <p className="m-0 font-medium text-[#222]">Customer Details</p>
          <p className="m-0 text-[#666]">
            <span className="text-[#8A8A8A]">Name:</span> {form.name}
          </p>
          <p className="m-0 text-[#666]">
            <span className="text-[#8A8A8A]">Email:</span> {form.email}
          </p>
          <p className="m-0 text-[#666]">
            <span className="text-[#8A8A8A]">Phone:</span> {form.phone}
          </p>
          <p className="m-0 text-[#666]">
            <span className="text-[#8A8A8A]">Status:</span> {form.status}
          </p>
        </div>

        <div className="rounded-lg border border-[#EDEDED] bg-[#F9F9F9] p-3 text-[11px] text-[#333] space-y-1.5">
          <p className="m-0 font-medium text-[#222]">Address</p>
          <p className="m-0 text-[#666]">{form.address.line1}</p>
          {form.address.line2 && <p className="m-0 text-[#666]">{form.address.line2}</p>}
          <p className="m-0 text-[#666]">
            {form.address.city}, {form.address.state} {form.address.postcode}
          </p>
          <p className="m-0 text-[#666]">{form.address.country}</p>
        </div>

        <div className="rounded-lg border border-[#EDEDED] bg-[#F9F9F9] p-3 text-[11px] text-[#333] space-y-1.5">
          <p className="m-0 font-medium text-[#222]">Payment</p>
          <p className="m-0 text-[#666]">{form.paymentMethod}</p>
        </div>

        <div className="mt-5 flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onPrevious}
            className="h-[32px] w-[80px] rounded-full border border-[#E5E5E5] bg-white text-[12px] font-medium text-[#333] hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
          >
            Previous
          </button>
          <button
            ref={submitButtonRef}
            type="submit"
            className="h-[32px] w-[80px] rounded-[6px] bg-primary text-[12px] font-medium text-white hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
