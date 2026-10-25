import { Check } from 'lucide-react'
import type { SubTask } from '../../types/tasks'

interface SubTaskListProps {
  subTasks: SubTask[]
  onToggleSubTask: (subTaskId: string) => void
}

export default function SubTaskList({ subTasks, onToggleSubTask }: SubTaskListProps) {
  if (!subTasks || subTasks.length === 0) return null

  return (
    <div className="mt-2.5 space-y-1.5" role="group" aria-label="Sub-tasks list">
      {subTasks.map((st) => (
        <button
          key={st.id}
          type="button"
          role="checkbox"
          aria-checked={st.done}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSubTask(st.id)
          }}
          className={`flex w-full items-center justify-between rounded-full px-3 py-1.5 text-left text-[11px] transition-colors ${
            st.done
              ? 'bg-[#F2F8F3] text-[#222222] hover:bg-[#E9F3EB]'
              : 'bg-[#F7F7F7] text-[#444444] hover:bg-[#EFEFEF]'
          }`}
        >
          <span className={`truncate font-normal ${st.done ? 'line-through text-[#666]' : ''}`}>
            {st.title}
          </span>

          {st.done ? (
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-task-primary text-white">
              <Check size={11} strokeWidth={3} />
            </span>
          ) : (
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300 bg-white"
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </div>
  )
}

