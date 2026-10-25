import Select from './Select'

interface InfoSelectProps {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  className?: string
}

export default function InfoSelect({ label, value, options, onChange, className = '' }: InfoSelectProps) {
  return (
    <div className={className}>
      <Select label={label} value={value} options={options} onChange={onChange} compact />
    </div>
  )
}
