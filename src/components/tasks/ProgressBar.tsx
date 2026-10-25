interface ProgressBarProps {
  percentage: number
  className?: string
}

export default function ProgressBar({ percentage, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAEA] ${className}`}
    >
      <div
        className="h-full rounded-full bg-task-primary transition-all duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

