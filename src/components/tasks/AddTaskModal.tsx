import { useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { Column, ColumnId, Task } from '../../types/tasks'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (taskData: Omit<Task, 'id'>) => void
  columns: Column[]
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  columns,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('Jun 20')
  const [columnId, setColumnId] = useState<ColumnId>(columns[0]?.id ?? 'todo')

  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      date: date.trim() || 'Jun 20',
      columnId,
      dashes: ['green', 'dark-green'],
      attachmentsCount: 0,
      commentsCount: 0,
      assignees: [],
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-2xl border border-[#EDEDED] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
          <h2 id={titleId} className="text-[17px] font-semibold text-[#222]">
            Add New Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-7 w-7 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-[#555] mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Landing Page"
              className="w-full rounded-xl border border-[#E5E5E5] px-3 py-2 text-[12px] text-[#222] outline-none focus:border-task-primary focus:ring-1 focus:ring-task-primary/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#555] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about the task"
              className="w-full resize-none rounded-xl border border-[#E5E5E5] px-3 py-2 text-[12px] text-[#222] outline-none focus:border-task-primary focus:ring-1 focus:ring-task-primary/30"
            />
          </div>

          {/* Row: Date & Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#555] mb-1">
                Due Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Jun 20"
                className="w-full rounded-xl border border-[#E5E5E5] px-3 py-2 text-[12px] text-[#222] outline-none focus:border-task-primary focus:ring-1 focus:ring-task-primary/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#555] mb-1">
                Column
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value as ColumnId)}
                className="w-full rounded-xl border border-[#E5E5E5] px-2.5 py-2 text-[12px] text-[#222] outline-none focus:border-task-primary focus:ring-1 focus:ring-task-primary/30 bg-white"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-5 flex items-center justify-end gap-2.5 pt-2 border-t border-[#F0F0F0]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-[12px] font-medium text-[#666] hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-xl bg-task-primary px-5 py-2 text-[12px] font-semibold text-white shadow-2xs hover:bg-task-primary-hover disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
