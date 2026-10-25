import { CALENDAR_COLORS } from '../types/calendar'

interface ColorPaletteProps {
  value: string
  onChange: (color: string) => void
}

export default function ColorPalette({ value, onChange }: ColorPaletteProps) {
  return (
    <div role="radiogroup" aria-label="Calendar color" className="grid grid-cols-5 gap-[10px] p-2">
      {CALENDAR_COLORS.map((color) => (
        <button
          key={color.hex}
          type="button"
          role="radio"
          data-menu-focus
          aria-label={color.name}
          aria-checked={value.toLowerCase() === color.hex.toLowerCase()}
          onClick={() => onChange(color.hex)}
          className="grid h-4 w-4 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#777]"
          style={{ backgroundColor: color.hex }}
        >
          {value.toLowerCase() === color.hex.toLowerCase() && (
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          )}
        </button>
      ))}
    </div>
  )
}
