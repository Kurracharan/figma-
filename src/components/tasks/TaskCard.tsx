import { useId, useState } from 'react'
import { Calendar, ChevronDown, ChevronUp, MessageSquare, Paperclip } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../types/tasks'
import AvatarStack from './AvatarStack'
import LabelDashes from './LabelDashes'
import ProgressBar from './ProgressBar'
import SubTaskList from './SubTaskList'

interface TaskCardProps {
  task: Task
  onToggleSubTask?: (taskId: string, subTaskId: string) => void
  onToggleExpand?: (taskId: string) => void
}

function CoverImage({ type }: { type: 'orange-mountain' | 'teal-mountain' }) {
  if (type === 'orange-mountain') {
    return (
      <div
        className="relative my-3 h-28 w-full overflow-hidden rounded-lg bg-linear-to-b from-[#FFF4EB] to-[#FDE1CD] border border-orange-100"
        aria-label="Orange mountain landscape cover"
      >
        <svg
          viewBox="0 0 300 120"
          className="absolute inset-0 h-full w-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Sun */}
          <circle cx="210" cy="35" r="14" fill="#FB923C" opacity="0.65" />
          {/* Back peak */}
          <polygon points="120,35 220,120 40,120" fill="#FDBA74" opacity="0.75" />
          {/* Mid peak */}
          <polygon points="210,50 300,120 130,120" fill="#FB923C" opacity="0.85" />
          {/* Front peak */}
          <polygon points="60,60 170,120 -30,120" fill="#EA580C" opacity="0.9" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="relative my-3 h-28 w-full overflow-hidden rounded-lg bg-linear-to-b from-[#E6F7F5] to-[#CCF0EC] border border-teal-100"
      aria-label="Teal mountain landscape cover"
    >
      <svg
        viewBox="0 0 300 120"
        className="absolute inset-0 h-full w-full object-cover"
        preserveAspectRatio="none"
      >
        {/* Sun */}
        <circle cx="80" cy="35" r="14" fill="#2DD4BF" opacity="0.65" />
        {/* Back peak */}
        <polygon points="170,35 270,120 80,120" fill="#5EEAD4" opacity="0.75" />
        {/* Mid peak */}
        <polygon points="70,45 180,120 -10,120" fill="#2DD4BF" opacity="0.85" />
        {/* Front peak */}
        <polygon points="230,55 330,120 140,120" fill="#0D9488" opacity="0.9" />
      </svg>
    </div>
  )
}

function ThumbnailRow() {
  return (
    <div className="my-3 grid grid-cols-3 gap-2" aria-label="Photo thumbnails">
      <div className="h-14 overflow-hidden rounded-md bg-[#FFF7ED] border border-orange-100 p-1">
        <div className="h-2 w-full rounded-xs bg-[#FDBA74]" />
        <div className="mt-2 h-6 rounded-xs bg-[#FED7AA]" />
      </div>
      <div className="h-14 overflow-hidden rounded-md bg-[#F0FDF4] border border-emerald-100 p-1">
        <div className="h-2 w-full rounded-xs bg-[#86EFAC]" />
        <div className="mt-2 h-6 rounded-xs bg-[#BBF7D0]" />
      </div>
      <div className="h-14 overflow-hidden rounded-md bg-[#F0F9FF] border border-sky-100 p-1">
        <div className="h-2 w-full rounded-xs bg-[#7DD3FC]" />
        <div className="mt-2 h-6 rounded-xs bg-[#BAE6FD]" />
      </div>
    </div>
  )
}

export default function TaskCard({
  task,
  onToggleSubTask,
  onToggleExpand,
}: TaskCardProps) {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(
    task.subTasksExpanded ?? false
  )

  const isExpanded =
    task.subTasksExpanded !== undefined ? task.subTasksExpanded : internalExpanded

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Calculate dynamic sub-task stats
  const totalSubTasks = task.subTasks?.length ?? 0
  const completedSubTasks = task.subTasks?.filter((st) => st.done).length ?? 0
  const progressPercent =
    totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0

  function handleToggle() {
    if (onToggleExpand) {
      onToggleExpand(task.id)
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const subtaskId = useId()

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
      className={`group relative rounded-xl border border-[#EDEDED] bg-white p-4 shadow-2xs transition-all duration-150 focus-within:ring-2 focus-within:ring-task-primary/30 hover:border-gray-300 hover:shadow-xs cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40 scale-[1.02] shadow-md z-30' : ''
      }`}
    >
      {/* Top Row: 1-2 small colored dash pills + Date with calendar icon */}
      <div className="flex items-center justify-between gap-2">
        <LabelDashes dashes={task.dashes} />

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A8A8A]">
          <Calendar size={13} strokeWidth={1.8} className="text-[#999]" />
          <span>{task.date}</span>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="mt-2 text-[14px] font-medium leading-snug text-[#222222]">
        {task.title}
      </h3>

      {/* Optional Description (2 lines max) */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8A8A8A]">
          {task.description}
        </p>
      )}

      {/* Optional Cover Image */}
      {task.coverImage && (
        <CoverImage type={task.coverImage as 'orange-mountain' | 'teal-mountain'} />
      )}

      {/* Optional 3-thumbnail row */}
      {task.thumbnails && <ThumbnailRow />}

      {/* Optional Sub-task section */}
      {task.subTasks && task.subTasks.length > 0 && (
        <div className="mt-3.5 border-t border-[#F2F2F2] pt-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="tracking-wide text-[#8A8A8A]">
              SUB-TASKS: {totalSubTasks}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#333] font-medium">{progressPercent}%</span>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={subtaskId}
                aria-label={isExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggle()
                }}
                className="grid h-5 w-5 place-items-center rounded-md text-[#8A8A8A] transition-colors hover:bg-gray-100 hover:text-[#333]"
              >
                {isExpanded ? (
                  <ChevronUp size={14} strokeWidth={2.2} />
                ) : (
                  <ChevronDown size={14} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>

          {/* Thin progress bar */}
          <ProgressBar percentage={progressPercent} className="mt-2" />

          {/* Expanded Subtask List */}
          {isExpanded && (
            <div id={subtaskId}>
              <SubTaskList
                subTasks={task.subTasks}
                onToggleSubTask={(stId) => onToggleSubTask?.(task.id, stId)}
              />
            </div>
          )}
        </div>
      )}

      {/* Footer: attachments count, comments count, avatar stack */}
      <div className="mt-3.5 flex items-center justify-between pt-1 text-[11px] text-[#8A8A8A]">
        <div className="flex items-center gap-3">
          {/* Hide paperclip when 0 */}
          {Boolean(task.attachmentsCount && task.attachmentsCount > 0) && (
            <span
              className="flex items-center gap-1 font-medium hover:text-[#555]"
              title={`${task.attachmentsCount} attachments`}
            >
              <Paperclip size={13} strokeWidth={1.8} />
              <span>{task.attachmentsCount}</span>
            </span>
          )}

          {/* Hide comments when 0 */}
          {Boolean(task.commentsCount && task.commentsCount > 0) && (
            <span
              className="flex items-center gap-1 font-medium hover:text-[#555]"
              title={`${task.commentsCount} comments`}
            >
              <MessageSquare size={13} strokeWidth={1.8} />
              <span>{task.commentsCount}</span>
            </span>
          )}
        </div>

        {/* Right side: Avatar stack */}
        <AvatarStack members={task.assignees} maxVisible={2} />
      </div>
    </article>
  )
}

