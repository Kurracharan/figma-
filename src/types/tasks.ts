export type ColumnId = string

export type LabelDashColor =
  | 'green'
  | 'dark-green'
  | 'teal'
  | 'cyan'
  | 'yellow'
  | 'purple'
  | 'orange'

export type SwatchColor =
  | 'coral-red'
  | 'teal'
  | 'amber-yellow'
  | 'dark-green'
  | 'cyan'
  | 'bright-green'
  | 'lime'
  | 'purple'
  | 'pink'
  | 'light-gray'

export interface Member {
  id: string
  name: string
  initials: string
  color: string
  avatarUrl?: string
}

export interface SubTask {
  id: string
  title: string
  done: boolean
}

export interface Task {
  id: string
  columnId: ColumnId
  title: string
  description?: string
  date: string
  dashes?: LabelDashColor[]
  coverImage?: string
  thumbnails?: string[]
  subTasks?: SubTask[]
  subTasksExpanded?: boolean
  attachmentsCount?: number
  commentsCount?: number
  assignees?: Member[]
}

export interface Column {
  id: ColumnId
  title: string
  accentColor: SwatchColor
  count?: number
  archivedTasks?: Task[]
}

export interface Project {
  id: string
  name: string
  columns: Column[]
  tasks: Task[]
}
