import type { LabelDashColor } from '../../types/tasks'

interface LabelDashesProps {
  dashes?: LabelDashColor[]
}

const colorMap: Record<LabelDashColor, string> = {
  green: 'bg-[#22C55E]',
  'dark-green': 'bg-[#176D25]',
  teal: 'bg-[#14B8A6]',
  cyan: 'bg-[#06B6D4]',
  yellow: 'bg-[#F59E0B]',
  purple: 'bg-[#A855F7]',
  orange: 'bg-[#F97316]',
}

export default function LabelDashes({ dashes = [] }: LabelDashesProps) {
  if (!dashes || dashes.length === 0) return null

  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {dashes.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className={`h-1.5 w-6 rounded-full ${colorMap[color] || 'bg-[#22C55E]'}`}
        />
      ))}
    </div>
  )
}

