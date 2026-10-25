import { X } from 'lucide-react'

export interface StepTabsProps {
  steps: string[]
  activeStep: number
  maxUnlockedStep: number
  onSelectStep: (index: number) => void
  onClose: () => void
}

export default function StepTabs({
  steps,
  activeStep,
  maxUnlockedStep,
  onSelectStep,
  onClose,
}: StepTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Add customer steps"
      className="flex items-center justify-between border-b border-[#EDEDED] px-4"
    >
      <div className="flex gap-4 overflow-x-auto">
        {steps.map((step, index) => {
          const isActive = activeStep === index
          const isDisabled = index > maxUnlockedStep

          return (
            <button
              key={step}
              type="button"
              role="tab"
              id={`step-tab-${step.toLowerCase()}`}
              aria-selected={isActive}
              aria-disabled={isDisabled}
              aria-controls={`step-panel-${step.toLowerCase()}`}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) onSelectStep(index)
              }}
              className={`flex h-11 shrink-0 items-center border-b-2 px-0.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.03em] transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : isDisabled
                    ? 'border-transparent text-[#999] opacity-50 cursor-not-allowed'
                    : 'border-transparent text-[#333] hover:text-primary cursor-pointer'
              }`}
            >
              {step}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="ml-2 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md bg-[#F3F3F3] text-[#333] hover:bg-[#E8E8E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
      >
        <X size={12} />
      </button>
    </div>
  )
}
