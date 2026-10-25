import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

export type DateSelectorOption = {
  value: string
  label: string
}

type DateSelectorProps = {
  options: DateSelectorOption[]
  value: string
  onChange: (value: string) => void
}

function DateSelector({ options, value, onChange }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className="date-selector" ref={containerRef}>
      <button className="date-button" type="button" onClick={() => setIsOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={isOpen}>
        <Icon name="calendar" size={16} />
        <span>{selectedOption.label}</span>
        <span className="chevron">⌄</span>
      </button>

      {isOpen && (
        <div className="date-menu" role="listbox" aria-label="Select time period">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === value ? 'date-menu-item active' : 'date-menu-item'}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateSelector
