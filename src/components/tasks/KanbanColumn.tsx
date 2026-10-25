import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Column, SwatchColor, Task } from '../../types/tasks'
import ColumnMenu from './ColumnMenu'
import TaskCard from './TaskCard'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  openMenuId: string | null
  onMenuChange: (id: string | null) => void
  canMoveLeft: boolean
  canMoveRight: boolean
  renameOnMount?: boolean
  onToggleSubTask?: (taskId: string, subTaskId: string) => void
  onToggleExpand?: (taskId: string) => void
  onAddTaskInline?: (columnId: Column['id'], title: string) => void
  onRenameColumn?: (columnId: Column['id'], newTitle: string) => void
  onMoveColumn: (columnId: Column['id'], direction: 'left' | 'right') => void
  onSortTasks: (columnId: Column['id'], by: 'date' | 'title' | 'comments') => void
  onCompleteTasks: (columnId: Column['id']) => void
  onArchiveTasks: (columnId: Column['id']) => void
  onDeleteTasks: (columnId: Column['id']) => void
  onColorChange: (columnId: Column['id'], color: SwatchColor) => void
}

const accentBarColors: Record<SwatchColor, string> = {
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

export default function KanbanColumn({
  column,
  tasks,
  openMenuId,
  onMenuChange,
  canMoveLeft,
  canMoveRight,
  renameOnMount = false,
  onToggleSubTask,
  onToggleExpand,
  onAddTaskInline,
  onRenameColumn,
  onMoveColumn,
  onSortTasks,
  onCompleteTasks,
  onArchiveTasks,
  onDeleteTasks,
  onColorChange,
}: KanbanColumnProps) {
  const [isRenaming, setIsRenaming] = useState(renameOnMount)
  const [newColumnTitle, setNewColumnTitle] = useState(column.title)
  const [isAddingInline, setIsAddingInline] = useState(false)
  const [inlineTitle, setInlineTitle] = useState('')
  const menuId = `column-menu-${column.id}`

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  function handleAddInlineSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!inlineTitle.trim()) return
    onAddTaskInline?.(column.id, inlineTitle.trim())
    setInlineTitle('')
    setIsAddingInline(false)
  }

  function handleRenameSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!newColumnTitle.trim()) return
    const title = newColumnTitle.trim().toUpperCase()
    setNewColumnTitle(title)
    onRenameColumn?.(column.id, title)
    setIsRenaming(false)
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl bg-white/70 p-3 backdrop-blur-xs transition-colors ${
        isOver ? 'bg-emerald-50/60 ring-2 ring-task-primary/30' : ''
      }`}
      aria-label={`${column.title} column`}
    >
      <div className={`h-1 w-full rounded-full ${accentBarColors[column.accentColor]}`} aria-hidden="true" />

      <div className="mb-3.5 mt-2.5 flex items-center justify-between px-1">
        <div className="flex min-w-0 items-center gap-2">
          {isRenaming ? (
            <form onSubmit={handleRenameSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(event) => setNewColumnTitle(event.target.value)}
                autoFocus
                aria-label="Column name"
                className="w-28 rounded-md border border-line px-1.5 py-0.5 text-[12px] font-semibold text-ink"
              />
              <button type="submit" className="text-[10px] font-semibold text-task-primary hover:underline">Save</button>
            </form>
          ) : (
            <h2 className="truncate text-[12px] font-bold tracking-wider text-ink">{column.title}</h2>
          )}
          <span className="grid h-5 min-w-5 place-items-center rounded-md bg-task-border px-1.5 text-[10px] font-bold text-gray-600">
            {tasks.length}
          </span>
        </div>

        <ColumnMenu
          column={column}
          taskCount={tasks.length}
          canMoveLeft={canMoveLeft}
          canMoveRight={canMoveRight}
          open={openMenuId === menuId}
          onOpenChange={(open) => onMenuChange(open ? menuId : null)}
          onMove={(direction) => onMoveColumn(column.id, direction)}
          onSort={(by) => onSortTasks(column.id, by)}
          onCompleteTasks={() => onCompleteTasks(column.id)}
          onArchiveTasks={() => onArchiveTasks(column.id)}
          onDeleteTasks={() => onDeleteTasks(column.id)}
          onColorChange={(color) => onColorChange(column.id, color)}
          onRename={() => setIsRenaming(true)}
        />
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[120px] flex-1 flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleSubTask={onToggleSubTask}
              onToggleExpand={onToggleExpand}
            />
          ))}

          {isAddingInline && (
            <form onSubmit={handleAddInlineSubmit} className="rounded-xl border border-task-primary bg-white p-3.5 shadow-sm animate-in fade-in zoom-in-95 duration-150">
              <textarea
                value={inlineTitle}
                onChange={(event) => setInlineTitle(event.target.value)}
                placeholder="What needs to be done?"
                rows={2}
                autoFocus
                className="w-full resize-none text-[13px] text-ink outline-none placeholder:text-muted"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingInline(false)
                    setInlineTitle('')
                  }}
                  className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" disabled={!inlineTitle.trim()} className="rounded-lg bg-task-primary px-3 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-task-primary-hover disabled:opacity-50">
                  Add Card
                </button>
              </div>
            </form>
          )}
        </div>
      </SortableContext>

      <div className="mt-4 flex items-center justify-center pb-1">
        <button
          type="button"
          onClick={() => setIsAddingInline(!isAddingInline)}
          aria-label={`Add new task to ${column.title}`}
          title="Add card"
          className="grid h-8 w-8 place-items-center rounded-xl bg-task-active-bg text-task-primary shadow-2xs transition-all hover:bg-light-green hover:scale-105 active:scale-95"
        >
          {isAddingInline ? <X size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2.4} />}
        </button>
      </div>
    </div>
  )
}
