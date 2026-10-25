import { useState } from 'react'
import { X } from 'lucide-react'
import type { CalendarCategory } from '../types/calendar'
import ColorPalette from './ColorPalette'

interface CalendarSettingsModalProps {
  category: CalendarCategory
  onClose: () => void
  onSave: (name: string, color: string) => void
}

export default function CalendarSettingsModal({ category, onClose, onSave }: CalendarSettingsModalProps) {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color)

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (trimmedName) onSave(trimmedName, color)
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 px-4" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <form role="dialog" aria-modal="true" aria-labelledby="calendar-settings-title" onSubmit={save} className="w-full max-w-[300px] rounded-[10px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="calendar-settings-title" className="m-0 text-[14px] font-medium text-[#222]">Calendar Settings</h2>
          <button type="button" aria-label="Close settings" onClick={onClose} className="grid h-6 w-6 place-items-center rounded-md text-[#777] hover:bg-[#F3F3F3]"><X size={14} /></button>
        </div>
        <label className="block text-[11px] text-[#777]">
          Calendar name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-8 w-full rounded-md border border-[#E5E5E5] px-2 text-[12px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </label>
        <p className="mb-0 mt-4 text-[11px] text-[#777]">Color</p>
        <ColorPalette value={color} onChange={setColor} />
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-8 rounded-md border border-[#E5E5E5] px-3 text-[11px] text-[#444]">Cancel</button>
          <button type="submit" className="h-8 rounded-md bg-primary px-3 text-[11px] font-medium text-white">Save</button>
        </div>
      </form>
    </div>
  )
}
