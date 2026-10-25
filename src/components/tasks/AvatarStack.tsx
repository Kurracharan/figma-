import type { Member } from '../../types/tasks'

interface AvatarStackProps {
  members?: Member[]
  maxVisible?: number
}

export default function AvatarStack({ members = [], maxVisible = 2 }: AvatarStackProps) {
  if (!members || members.length === 0) return null

  const visible = members.slice(0, maxVisible)
  const remainder = members.length - maxVisible

  return (
    <div className="flex items-center -space-x-1.5 overflow-hidden">
      {visible.map((member) => (
        <span
          key={member.id}
          className="grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[9px] font-semibold text-[#3E3B37] shadow-2xs"
          style={{ backgroundColor: member.color }}
          title={member.name}
        >
          {member.initials}
        </span>
      ))}
      {remainder > 0 && (
        <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-gray-200 text-[8.5px] font-bold text-gray-700 shadow-2xs">
          +{remainder}
        </span>
      )}
    </div>
  )
}

