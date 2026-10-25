import { Plus, SlidersHorizontal } from 'lucide-react'
import type { Project } from '../../types/tasks'
import AddMenuDropdown from './AddMenuDropdown'
import ProjectSwitcherPopover from './ProjectSwitcherPopover'

interface BoardHeaderProps {
  currentProject: Project
  projects: Project[]
  openMenuId: string | null
  onMenuChange: (id: string | null) => void
  onSelectProject: (project: Project) => void
  onOpenAddModal: () => void
  onOpenNewProject: () => void
  onAddBoard: () => void
  onOpenInviteModal: () => void
  onToggleFilter?: () => void
}

export default function BoardHeader({
  currentProject,
  projects,
  openMenuId,
  onMenuChange,
  onSelectProject,
  onOpenAddModal,
  onOpenNewProject,
  onAddBoard,
  onOpenInviteModal,
  onToggleFilter,
}: BoardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent px-6 py-4">
      <ProjectSwitcherPopover
        currentProject={currentProject}
        projects={projects}
        open={openMenuId === 'project-switcher'}
        onOpenChange={(open) => onMenuChange(open ? 'project-switcher' : null)}
        onSelectProject={onSelectProject}
      />

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleFilter}
          aria-label="Filter board"
          title="Filter tasks"
          className="grid h-9 w-9 place-items-center rounded-xl border border-task-border bg-white text-gray-600 shadow-2xs transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-ink active:scale-95"
        >
          <SlidersHorizontal size={15} strokeWidth={2} />
        </button>

        <div className="inline-flex items-center rounded-xl bg-task-primary text-white shadow-2xs transition-colors hover:bg-task-primary-hover active:scale-[0.98]">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-l-xl px-3.5 py-2 text-[12px] font-semibold text-white"
          >
            <Plus size={15} strokeWidth={2.4} />
            <span>Add</span>
          </button>
          <AddMenuDropdown
            open={openMenuId === 'add-menu'}
            onOpenChange={(open) => onMenuChange(open ? 'add-menu' : null)}
            onAddTask={onOpenAddModal}
            onAddBoard={onAddBoard}
            onAddProject={onOpenNewProject}
            onInvite={onOpenInviteModal}
          />
        </div>
      </div>
    </div>
  )
}
