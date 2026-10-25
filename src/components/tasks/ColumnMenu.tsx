import { useState } from 'react'
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Check,
  ChevronRight,
  MoreHorizontal,
  Move,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Column, SwatchColor } from '../../types/tasks'
import ColorSwatchPicker from './ColorSwatchPicker'
import { Menu, MenuDivider, MenuHeading, MenuItem } from './Menu'

interface ColumnMenuProps {
  column: Column
  taskCount: number
  canMoveLeft: boolean
  canMoveRight: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onMove: (direction: 'left' | 'right') => void
  onSort: (by: 'date' | 'title' | 'comments') => void
  onCompleteTasks: () => void
  onArchiveTasks: () => void
  onDeleteTasks: () => void
  onColorChange: (color: SwatchColor) => void
  onRename: () => void
}

export default function ColumnMenu({
  column,
  taskCount,
  canMoveLeft,
  canMoveRight,
  open,
  onOpenChange,
  onMove,
  onSort,
  onCompleteTasks,
  onArchiveTasks,
  onDeleteTasks,
  onColorChange,
  onRename,
}: ColumnMenuProps) {
  const [submenu, setSubmenu] = useState<'main' | 'move' | 'sort'>('main')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function runAction(action: () => void) {
    action()
    onOpenChange(false)
  }

  return (
    <>
      <Menu
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setSubmenu('main')
          onOpenChange(nextOpen)
        }}
        width={200}
        align="right"
        trigger={(triggerProps) => (
          <button
            {...triggerProps}
            aria-label={`Options for ${column.title} column`}
            className="grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <MoreHorizontal size={16} strokeWidth={2} />
          </button>
        )}
      >
        {submenu === 'main' ? (
          <>
            <MenuItem icon={<Move size={16} />} trailing={<ChevronRight size={14} className="text-muted" />} onSelect={() => setSubmenu('move')}>
              Move
            </MenuItem>
            <MenuItem icon={<Pencil size={15} />} onSelect={() => runAction(onRename)}>
              Rename column
            </MenuItem>
            <MenuItem icon={<ArrowUpDown size={16} />} trailing={<ChevronRight size={14} className="text-muted" />} onSelect={() => setSubmenu('sort')}>
              Sort Tasks
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<Check size={16} />} onSelect={() => runAction(onCompleteTasks)}>
              Complete Tasks
            </MenuItem>
            <MenuItem icon={<Archive size={16} />} onSelect={() => runAction(onArchiveTasks)}>
              Archive Tasks
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<Trash2 size={16} />} destructive onSelect={() => setConfirmingDelete(true)}>
              Delete Tasks
            </MenuItem>
            <MenuDivider />
            <ColorSwatchPicker value={column.accentColor} onChange={onColorChange} />
          </>
        ) : (
          <>
            <MenuItem icon={<ArrowLeft size={15} />} onSelect={() => setSubmenu('main')}>
              {submenu === 'move' ? 'Move column' : 'Sort Tasks'}
            </MenuItem>
            <MenuDivider />
            {submenu === 'move' ? (
              <>
                <MenuItem
                  icon={<ArrowLeft size={15} />}
                  disabled={!canMoveLeft}
                  onSelect={() => runAction(() => onMove('left'))}
                >
                  Move left
                </MenuItem>
                <MenuItem
                  icon={<ArrowRight size={15} />}
                  disabled={!canMoveRight}
                  onSelect={() => runAction(() => onMove('right'))}
                >
                  Move right
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onSelect={() => runAction(() => onSort('date'))}>By date</MenuItem>
                <MenuItem onSelect={() => runAction(() => onSort('title'))}>By title</MenuItem>
                <MenuItem onSelect={() => runAction(() => onSort('comments'))}>By comments</MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
      {confirmingDelete && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmingDelete(false)
          }}
        >
          <div role="alertdialog" aria-modal="true" className="w-full max-w-[340px] rounded-xl border border-task-border bg-white p-4 shadow-lg">
            <MenuHeading>Delete tasks?</MenuHeading>
            <p className="px-2 pb-4 text-[13px] leading-5 text-gray-600">
              Delete all {taskCount} {taskCount === 1 ? 'task' : 'tasks'} from {column.title}? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmingDelete(false)} className="h-9 rounded-lg px-3 text-[13px] text-gray-600 hover:bg-gray-100">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  onDeleteTasks()
                  setConfirmingDelete(false)
                  onOpenChange(false)
                }}
                className="h-9 rounded-lg bg-red-600 px-3 text-[13px] font-medium text-white hover:bg-red-700"
              >
                Delete tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
