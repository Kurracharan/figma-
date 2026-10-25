import { useState } from 'react'
import { Check, X } from 'lucide-react'

export interface NewCalendarPanelProps {
  onClose: () => void
  onCreate: (calendar: { name: string; description: string; color: string }) => void
}

const colorPalette = [
  '#FF7A70', // Coral/Red
  '#3CCFBF', // Teal
  '#26C6E0', // Cyan/Blue
  '#3FB36B', // Green
  '#FFC83D', // Yellow/Orange
  '#8A8F98', // Gray
  '#9B51E0', // Purple
  '#FF4081', // Pink
  '#2F80ED', // Blue
  '#F2994A', // Orange
]

export default function NewCalendarPanel({ onClose, onCreate }: NewCalendarPanelProps) {
  const [name, setName] = useState('Personal')
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorPalette[0])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    onCreate({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    })
  }

  return (
    <aside className="w-[290px] shrink-0 border-r border-[#EDEDED] bg-white p-5 shadow-[4px_0_16px_rgba(0,0,0,0.03)] z-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="m-0 text-[18px] font-medium text-[#222]">New Calendar</h2>
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-md text-[#777] hover:bg-[#F3F3F3]"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="calendar-name" className="mb-1.5 block text-[11px] font-normal text-[#8A8A8A]">
            Name
          </label>
          <input
            id="calendar-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="calendar-description" className="mb-1.5 block text-[11px] font-normal text-[#8A8A8A]">
            Description
          </label>
          <textarea
            id="calendar-description"
            rows={3}
            placeholder="Type something"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-[90px] w-full resize-none rounded-lg border border-[#E5E5E5] bg-white p-3 text-[12px] text-[#222] outline-none placeholder:text-[#A0A0A0] focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Color Section */}
        <div>
          <span className="mb-2 block text-[11px] font-normal text-[#8A8A8A]">Color</span>
          <div className="grid grid-cols-5 gap-2.5">
            {colorPalette.map((color) => {
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Select color ${color}`}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-105 focus:outline-none ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  {isSelected && <Check size={14} className="text-white" strokeWidth={2.5} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Create Button */}
        <div className="pt-3">
          <button
            type="submit"
            className="h-[38px] w-full rounded-lg bg-primary text-[12px] font-medium text-white transition-colors hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
          >
            Create
          </button>
        </div>
      </form>
    </aside>
  )
}
