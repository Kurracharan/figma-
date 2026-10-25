import { useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Layers2, Search } from 'lucide-react'
import type { Project } from '../../types/tasks'
import { Menu, MenuHeading, MenuItem, MenuDivider } from './Menu'

interface ProjectSwitcherPopoverProps {
  currentProject: Project
  projects: Project[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProject: (project: Project) => void
}

export default function ProjectSwitcherPopover({
  currentProject,
  projects,
  open,
  onOpenChange,
  onSelectProject,
}: ProjectSwitcherPopoverProps) {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const filteredProjects = useMemo(
    () => projects.filter((project) => project.name.toLowerCase().includes(query.trim().toLowerCase())),
    [projects, query]
  )

  return (
    <Menu
      open={open}
      onOpenChange={onOpenChange}
      width={280}
      initialFocusRef={searchRef}
      trigger={(triggerProps) => (
        <button
          {...triggerProps}
          onClick={() => {
            if (!open) setQuery('')
            triggerProps.onClick()
          }}
          className="group flex items-center gap-2 rounded-xl py-1 pr-2 text-left transition-colors hover:bg-gray-100/70"
        >
          <span className="text-[20px] font-semibold tracking-tight text-ink">{currentProject.name}</span>
          <ChevronDown size={16} strokeWidth={2.2} className="text-muted transition-transform group-hover:text-gray-700" />
        </button>
      )}
    >
      <MenuHeading>Projects</MenuHeading>
      <div className="relative mx-1 mb-2 mt-1">
        <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={searchRef}
          type="search"
          aria-label="Search projects"
          placeholder="Search Project..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-9 w-full rounded-lg border border-line bg-white pl-8 pr-2 text-[13px] text-ink outline-none placeholder:text-muted focus:border-task-primary focus:ring-1 focus:ring-task-primary/20"
        />
      </div>
      <MenuDivider />
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <MenuItem
            key={project.id}
            icon={<Layers2 size={16} />}
            onSelect={() => {
              onSelectProject(project)
              onOpenChange(false)
            }}
            trailing={project.id === currentProject.id ? <Check size={16} className="text-emerald-600" /> : undefined}
          >
            {project.name}
          </MenuItem>
        ))
      ) : (
        <p className="px-2 py-3 text-[13px] text-muted">No projects found</p>
      )}
    </Menu>
  )
}
