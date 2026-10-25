import { useState } from 'react'
import { X } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import AddTaskModal from '../components/tasks/AddTaskModal'
import InviteMembersModal from '../components/chat/InviteMembersModal'
import AppSidebar from '../components/tasks/AppSidebar'
import BoardHeader from '../components/tasks/BoardHeader'
import KanbanColumn from '../components/tasks/KanbanColumn'
import TaskCard from '../components/tasks/TaskCard'
import TopBar from '../components/tasks/TopBar'
import { initialPeople } from '../data/chat'
import { initialProjects } from '../data/taskProjects'
import type { Column, ColumnId, Project, SwatchColor, Task } from '../types/tasks'

export default function TaskBoardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [currentProjectId, setCurrentProjectId] = useState(initialProjects[0].id)
  const [columns, setColumns] = useState<Column[]>(initialProjects[0].columns)
  const [tasks, setTasks] = useState<Task[]>(initialProjects[0].tasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [renameColumnId, setRenameColumnId] = useState<ColumnId | null>(null)
  const currentProject = projects.find((project) => project.id === currentProjectId) ?? projects[0]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Subtask toggling per card
  function handleToggleSubTask(taskId: string, subTaskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId || !t.subTasks) return t
        const updatedSubTasks = t.subTasks.map((st) =>
          st.id === subTaskId ? { ...st, done: !st.done } : st
        )
        return { ...t, subTasks: updatedSubTasks }
      })
    )
  }

  // Subtask expand / collapse toggle
  function handleToggleExpand(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, subTasksExpanded: !t.subTasksExpanded } : t
      )
    )
  }

  // Inline add task at bottom of column
  function handleAddTaskInline(columnId: ColumnId, title: string) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      columnId,
      title,
      date: 'Jun 20',
      dashes: ['green'],
      attachmentsCount: 0,
      commentsCount: 0,
      assignees: [],
    }
    setTasks((prev) => [...prev, newTask])
  }

  function handleAddBoard() {
    const id = `column-${Date.now()}`
    const newColumn: Column = {
      id,
      title: 'NEW COLUMN',
      accentColor: 'bright-green',
      archivedTasks: [],
    }
    setColumns((prev) => [...prev, newColumn])
    setRenameColumnId(id)
  }

  function handleSelectProject(project: Project) {
    setCurrentProjectId(project.id)
    setColumns(project.columns)
    setTasks(project.tasks)
    setRenameColumnId(null)
  }

  function handleCreateProject(event: React.FormEvent) {
    event.preventDefault()
    const name = newProjectName.trim()
    if (!name) return
    const id = `project-${Date.now()}`
    const project: Project = {
      id,
      name,
      columns: [
        { id: `${id}-todo`, title: 'TODO', accentColor: 'amber-yellow', archivedTasks: [] },
        { id: `${id}-progress`, title: 'IN PROGRESS', accentColor: 'cyan', archivedTasks: [] },
        { id: `${id}-completed`, title: 'COMPLETED', accentColor: 'bright-green', archivedTasks: [] },
      ],
      tasks: [],
    }
    setProjects((prev) => [...prev, project])
    setCurrentProjectId(project.id)
    setColumns(project.columns)
    setTasks([])
    setNewProjectName('')
    setIsNewProjectModalOpen(false)
  }

  // Header Add Task Modal submit
  function handleAddTaskFromModal(taskData: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    }

    setTasks((prev) => [...prev, newTask])
  }

  // Clear all tasks in a column
  function handleClearColumn(columnId: ColumnId) {
    setTasks((prev) => prev.filter((t) => t.columnId !== columnId))
  }

  // Rename column title
  function handleRenameColumn(columnId: ColumnId, newTitle: string) {
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, title: newTitle } : c))
    )
    setRenameColumnId(null)
  }

  function handleMoveColumn(columnId: ColumnId, direction: 'left' | 'right') {
    setColumns((prev) => {
      const index = prev.findIndex((column) => column.id === columnId)
      const nextIndex = index + (direction === 'left' ? -1 : 1)
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev
      const updated = [...prev]
      const [column] = updated.splice(index, 1)
      updated.splice(nextIndex, 0, column)
      return updated
    })
  }

  function handleSortTasks(columnId: ColumnId, by: 'date' | 'title' | 'comments') {
    setTasks((prev) => {
      const taskIndexes = prev
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => task.columnId === columnId)
      const sorted = [...taskIndexes].sort((a, b) => {
        if (by === 'title') return a.task.title.localeCompare(b.task.title)
        if (by === 'comments') return (b.task.commentsCount ?? 0) - (a.task.commentsCount ?? 0)
        return Date.parse(`${a.task.date} 2026`) - Date.parse(`${b.task.date} 2026`)
      })
      const updated = [...prev]
      taskIndexes.forEach(({ index }, i) => {
        updated[index] = sorted[i].task
      })
      return updated
    })
  }

  function handleCompleteTasks(columnId: ColumnId) {
    const completedColumn = columns.find((column) => /completed|done|shipped|review/i.test(column.title))
    if (!completedColumn || completedColumn.id === columnId) return
    setTasks((prev) => prev.map((task) => task.columnId === columnId ? { ...task, columnId: completedColumn.id } : task))
  }

  function handleArchiveTasks(columnId: ColumnId) {
    const archivedTasks = tasks.filter((task) => task.columnId === columnId)
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, archivedTasks: [...(column.archivedTasks ?? []), ...archivedTasks] }
          : column
      )
    )
    setTasks((prev) => prev.filter((task) => task.columnId !== columnId))
  }

  function handleChangeColumnColor(columnId: ColumnId, color: SwatchColor) {
    setColumns((prev) =>
      prev.map((column) => column.id === columnId ? { ...column, accentColor: color } : column)
    )
  }

  // DND Handlers
  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const foundTask = tasks.find((t) => t.id === active.id)
    if (foundTask) {
      setActiveTask(foundTask)
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const activeItem = tasks.find((t) => t.id === activeId)
    if (!activeItem) return

    // Case 1: Dragging over another task
    const overItem = tasks.find((t) => t.id === overId)
    if (overItem) {
      if (activeItem.columnId !== overItem.columnId) {
        setTasks((prev) => {
          const activeIndex = prev.findIndex((t) => t.id === activeId)
          const overIndex = prev.findIndex((t) => t.id === overId)

          const updated = [...prev]
          updated[activeIndex] = {
            ...updated[activeIndex],
            columnId: overItem.columnId,
          }

          // Move active item right next to over item
          const [removed] = updated.splice(activeIndex, 1)
          updated.splice(overIndex, 0, removed)
          return updated
        })
      }
      return
    }

    // Case 2: Dragging over a column container directly
    const isOverColumn = columns.some((c) => c.id === overId)
    if (isOverColumn && activeItem.columnId !== overId) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId)
        const updated = [...prev]
        updated[activeIndex] = {
          ...updated[activeIndex],
          columnId: overId as ColumnId,
        }
        return updated
      })
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const activeIndex = tasks.findIndex((t) => t.id === activeId)
    const overIndex = tasks.findIndex((t) => t.id === overId)

    if (activeIndex !== -1 && overIndex !== -1) {
      setTasks((prev) => {
        const updated = [...prev]
        const [moved] = updated.splice(activeIndex, 1)
        updated.splice(overIndex, 0, moved)
        return updated
      })
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans text-ink">
      {/* 1. Left Sidebar (~190px, white, right border) */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-canvas">
        {/* 2. Top Bar */}
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* 3. Board Header */}
        <BoardHeader
          currentProject={currentProject}
          projects={projects}
          openMenuId={openMenuId}
          onMenuChange={setOpenMenuId}
          onSelectProject={handleSelectProject}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          onAddBoard={handleAddBoard}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />

        {/* 4. Kanban Board Area (3 equal columns on light-gray bg) */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 min-w-[768px] md:min-w-0 snap-x">
              {columns.map((column) => {
                const columnTasks = tasks.filter((t) => t.columnId === column.id)

                return (
                  <div
                    key={column.id}
                    className="flex flex-col h-full min-h-0 snap-start"
                  >
                    <div className="flex-1 overflow-y-auto pr-1">
                      <KanbanColumn
                        column={column}
                        tasks={columnTasks}
                        openMenuId={openMenuId}
                        onMenuChange={setOpenMenuId}
                        canMoveLeft={columns.findIndex((item) => item.id === column.id) > 0}
                        canMoveRight={columns.findIndex((item) => item.id === column.id) < columns.length - 1}
                        renameOnMount={renameColumnId === column.id}
                        onToggleSubTask={handleToggleSubTask}
                        onToggleExpand={handleToggleExpand}
                        onAddTaskInline={handleAddTaskInline}
                        onRenameColumn={handleRenameColumn}
                        onMoveColumn={handleMoveColumn}
                        onSortTasks={handleSortTasks}
                        onCompleteTasks={handleCompleteTasks}
                        onArchiveTasks={handleArchiveTasks}
                        onDeleteTasks={handleClearColumn}
                        onColorChange={handleChangeColumnColor}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Drag Overlay for smooth card visual during drag */}
            <DragOverlay>
              {activeTask ? (
                <div className="w-[300px] rotate-2 shadow-2xl">
                  <TaskCard task={activeTask} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        key={isAddModalOpen ? 'open' : 'closed'}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTaskFromModal}
        columns={columns}
      />

      {isNewProjectModalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsNewProjectModalOpen(false)
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="new-project-title" className="w-full max-w-[360px] rounded-2xl border border-task-border bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 id="new-project-title" className="text-[17px] font-semibold text-ink">New project</h2>
              <button type="button" onClick={() => setIsNewProjectModalOpen(false)} aria-label="Close new project dialog" className="grid h-7 w-7 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="mt-4">
              <label htmlFor="new-project-name" className="mb-1 block text-[12px] font-medium text-gray-600">Project name</label>
              <input
                id="new-project-name"
                autoFocus
                required
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                placeholder="e.g. Mobile App"
                className="h-10 w-full rounded-xl border border-line px-3 text-[13px] text-ink outline-none focus:border-task-primary focus:ring-1 focus:ring-task-primary/30"
              />
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="h-9 rounded-xl px-3 text-[12px] text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={!newProjectName.trim()} className="h-9 rounded-xl bg-task-primary px-4 text-[12px] font-semibold text-white hover:bg-task-primary-hover disabled:opacity-50">Create project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <InviteMembersModal
        key={isInviteModalOpen ? 'board-invite-open' : 'board-invite-closed'}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={() => setIsInviteModalOpen(false)}
        allMembers={initialPeople}
        initiallySelectedIds={initialPeople.filter((person) => person.invited).map((person) => person.id)}
        teamName={currentProject.name}
      />
    </div>
  )
}
