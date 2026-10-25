import { useState } from 'react'
import { ClipboardList, ChevronDown, FolderKanban, Grid2X2, UserPlus } from 'lucide-react'
import { Menu, MenuItem } from './Menu'

interface AddMenuDropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: () => void
  onAddBoard: () => void
  onAddProject: () => void
  onInvite: () => void
}

export default function AddMenuDropdown({
  open,
  onOpenChange,
  onAddTask,
  onAddBoard,
  onAddProject,
  onInvite,
}: AddMenuDropdownProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>('board')

  return (
    <Menu
      open={open}
      onOpenChange={onOpenChange}
      width={150}
      align="right"
      trigger={(triggerProps) => (
        <button
          {...triggerProps}
          aria-label="More add options"
          className={`rounded-r-xl border-l border-white/25 px-2 py-2 text-white transition-colors ${
            open ? 'bg-white/15' : 'hover:bg-white/15'
          }`}
        >
          <ChevronDown size={14} strokeWidth={2.4} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
    >
      <MenuItem
        icon={<ClipboardList size={16} />}
        onSelect={() => {
          onAddTask()
          onOpenChange(false)
        }}
        className={hoveredItem === 'task' ? 'bg-gray-100' : ''}
        onMouseEnter={() => setHoveredItem('task')}
      >
        Task
      </MenuItem>
      <MenuItem
        icon={<Grid2X2 size={16} />}
        onSelect={() => {
          onAddBoard()
          onOpenChange(false)
        }}
        className={hoveredItem === 'board' ? 'bg-gray-100' : ''}
        onMouseEnter={() => setHoveredItem('board')}
      >
        Board
      </MenuItem>
      <MenuItem
        icon={<FolderKanban size={16} />}
        onSelect={() => {
          onAddProject()
          onOpenChange(false)
        }}
        className={hoveredItem === 'project' ? 'bg-gray-100' : ''}
        onMouseEnter={() => setHoveredItem('project')}
      >
        Project
      </MenuItem>
      <MenuItem
        icon={<UserPlus size={16} />}
        onSelect={() => {
          onInvite()
          onOpenChange(false)
        }}
        className={hoveredItem === 'invite' ? 'bg-gray-100' : ''}
        onMouseEnter={() => setHoveredItem('invite')}
      >
        Invite
      </MenuItem>
    </Menu>
  )
}
