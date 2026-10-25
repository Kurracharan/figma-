import type { Column, Project, SwatchColor, Task } from '../types/tasks'
import { initialColumns, initialTasks } from './tasks'

function makeColumns(
  projectId: string,
  titles: [string, string, string],
  colors: [SwatchColor, SwatchColor, SwatchColor]
): Column[] {
  return titles.map((title, index) => ({
    id: `${projectId}-${['todo', 'progress', 'completed'][index]}`,
    title,
    accentColor: colors[index],
    archivedTasks: [],
  }))
}

function makeTasks(columns: Column[], titles: string[]): Task[] {
  const columnByStage = [columns[0], columns[1], columns[2]]
  return initialTasks.map((task, index) => ({
    ...task,
    id: `${columns[0].id}-task-${index + 1}`,
    columnId:
      columnByStage[['todo', 'inprogress', 'completed'].indexOf(task.columnId)]?.id ??
      columns[0].id,
    title: titles[index] ?? task.title,
    subTasks: task.subTasks?.map((subTask) => ({ ...subTask })),
    assignees: task.assignees?.map((member) => ({ ...member })),
  }))
}

const designColumns = initialColumns.map((column) => ({
  ...column,
  archivedTasks: [],
}))

export const initialProjects: Project[] = [
  {
    id: 'design-plans',
    name: 'Design Plans',
    columns: designColumns,
    tasks: initialTasks.map((task) => ({ ...task })),
  },
  {
    id: 'wireframe-ui-kit',
    name: 'Wireframe UI Kit',
    columns: makeColumns('wireframe', ['BACKLOG', 'IN PROGRESS', 'READY FOR REVIEW'], ['amber-yellow', 'cyan', 'bright-green']),
    tasks: [],
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    columns: makeColumns('admin', ['TODO', 'BUILDING', 'DONE'], ['purple', 'teal', 'dark-green']),
    tasks: [],
  },
  {
    id: 'sochi-hotel-booking',
    name: 'Sochi – Hotel Booking',
    columns: makeColumns('sochi', ['IDEAS', 'IN PROGRESS', 'SHIPPED'], ['coral-red', 'cyan', 'bright-green']),
    tasks: [],
  },
]

initialProjects[1].tasks = makeTasks(initialProjects[1].columns, [
  'Define spacing and grid system',
  'Build navigation wireframes',
  'Prepare mobile component set',
  'Map common form patterns',
  'Review typography scale',
  'Finalize icon library',
  'Document reusable cards',
  'Export UI kit assets',
])
initialProjects[2].tasks = makeTasks(initialProjects[2].columns, [
  'Create dashboard overview',
  'Add user management table',
  'Design analytics widgets',
  'Connect activity feed',
  'Review access controls',
  'Build settings screens',
  'Polish responsive layouts',
  'Prepare release notes',
])
initialProjects[3].tasks = makeTasks(initialProjects[3].columns, [
  'Research booking journey',
  'Design hotel detail page',
  'Add room availability flow',
  'Review checkout experience',
  'Create destination filters',
  'Add guest details form',
  'Polish booking summary',
  'Prepare handoff assets',
])
