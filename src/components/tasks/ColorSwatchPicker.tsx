import type { SwatchColor } from '../../types/tasks'

const swatchColors: SwatchColor[] = [
  'coral-red',
  'teal',
  'amber-yellow',
  'dark-green',
  'cyan',
  'bright-green',
  'lime',
  'purple',
  'pink',
  'light-gray',
]

const swatchClasses: Record<SwatchColor, string> = {
  'coral-red': 'bg-task-swatches-coral-red',
  teal: 'bg-task-swatches-teal',
  'amber-yellow': 'bg-task-swatches-amber-yellow',
  'dark-green': 'bg-task-swatches-dark-green',
  cyan: 'bg-task-swatches-cyan',
  'bright-green': 'bg-task-swatches-bright-green',
  lime: 'bg-task-swatches-lime',
  purple: 'bg-task-swatches-purple',
  pink: 'bg-task-swatches-pink',
  'light-gray': 'bg-task-swatches-light-gray',
}

interface ColorSwatchPickerProps {
  value: string
  onChange: (color: SwatchColor) => void
}

export default function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
  return (
    <div className="grid grid-cols-5 justify-items-center gap-x-3 gap-y-2 px-2 py-2" aria-label="Column accent color">
      {swatchColors.map((color) => (
        <button
          key={color}
          type="button"
          role="menuitem"
          tabIndex={-1}
          aria-label={`Set column color to ${color.replace('-', ' ')}`}
          aria-checked={value === color}
          onClick={() => onChange(color)}
          className={`grid h-4 w-4 place-items-center rounded-full ${swatchClasses[color]} ${
            value === color ? 'ring-2 ring-gray-600 ring-offset-2 ring-offset-white' : ''
          }`}
        >
          {value === color && <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />}
        </button>
      ))}
    </div>
  )
}
