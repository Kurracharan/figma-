import type { Column, Member, Task } from '../types/tasks'

export const mockMembers: Record<string, Member> = {
  alex: { id: 'm1', name: 'Alex Morgan', initials: 'AM', color: '#D7B29A' },
  dustin: { id: 'm2', name: 'Dustin Williamson', initials: 'DW', color: '#9ABBB3' },
  jane: { id: 'm3', name: 'Jane Wilson', initials: 'JW', color: '#C8A7B3' },
  brandon: { id: 'm4', name: 'Brandon Pena', initials: 'BP', color: '#B49A7E' },
  regina: { id: 'm5', name: 'Regina Cooper', initials: 'RC', color: '#879FBE' },
}

export const initialColumns: Column[] = [
  { id: 'todo', title: 'TODO', accentColor: 'amber-yellow', count: 8 },
  { id: 'inprogress', title: 'IN PROGRESS', accentColor: 'cyan', count: 5 },
  { id: 'completed', title: 'COMPLETED', accentColor: 'bright-green', count: 9 },
]

export const initialTasks: Task[] = [
  // TODO
  {
    id: 'task-1',
    columnId: 'todo',
    title: 'Brand Logo Design',
    description: 'Make a redesign of the logo in corporate colors.',
    date: 'Jun 17',
    dashes: ['green', 'dark-green'],
    attachmentsCount: 2,
    commentsCount: 5,
    assignees: [mockMembers.alex, mockMembers.dustin],
  },
  {
    id: 'task-2',
    columnId: 'todo',
    title: 'New Header Image',
    date: 'Jun 18',
    dashes: ['yellow', 'teal'],
    coverImage: 'orange-mountain',
    attachmentsCount: 1,
    commentsCount: 3,
    assignees: [mockMembers.jane],
  },
  {
    id: 'task-3',
    columnId: 'todo',
    title: 'Wireframe for App',
    description: 'Make a wireframe for an app for a pre-presentation.',
    date: 'Jun 19',
    dashes: ['purple', 'teal'],
    attachmentsCount: 0,
    commentsCount: 1,
    assignees: [mockMembers.dustin, mockMembers.brandon],
  },

  // IN PROGRESS
  {
    id: 'task-4',
    columnId: 'inprogress',
    title: 'Updating Modules',
    description: 'Step-by-step update of modules.',
    date: 'Jun 16',
    dashes: ['teal'],
    subTasks: [
      { id: 'st-4-1', title: 'Analysis of current code', done: true },
      { id: 'st-4-2', title: 'Refactor core module', done: true },
      { id: 'st-4-3', title: 'Security validation', done: false },
      { id: 'st-4-4', title: 'Integration test suite', done: false },
    ],
    subTasksExpanded: false,
    attachmentsCount: 2,
    commentsCount: 5,
    assignees: [mockMembers.regina, mockMembers.alex],
  },
  {
    id: 'task-5',
    columnId: 'inprogress',
    title: 'Template Progress',
    description: 'Designing cool UI design templates.',
    date: 'Jun 15',
    dashes: ['green', 'cyan'],
    subTasks: [
      { id: 'st-5-1', title: 'Inbox Template', done: true },
      { id: 'st-5-2', title: 'Chat Template', done: true },
      { id: 'st-5-3', title: 'Tasks Template', done: true },
      { id: 'st-5-4', title: 'Projects Template', done: false },
    ],
    subTasksExpanded: true,
    attachmentsCount: 2,
    commentsCount: 5,
    assignees: [mockMembers.dustin, mockMembers.jane],
  },

  // COMPLETED
  {
    id: 'task-6',
    columnId: 'completed',
    title: 'Refresh Photo Slider',
    date: 'Jun 14',
    dashes: ['green'],
    thumbnails: ['thumb-1', 'thumb-2', 'thumb-3'],
    attachmentsCount: 3,
    commentsCount: 2,
    assignees: [mockMembers.brandon, mockMembers.regina],
  },
  {
    id: 'task-7',
    columnId: 'completed',
    title: 'Server Startup',
    description: 'Running the server in test mode and configuring.',
    date: 'Jun 13',
    dashes: ['dark-green'],
    attachmentsCount: 0,
    commentsCount: 17,
    assignees: [mockMembers.alex, mockMembers.dustin],
  },
  {
    id: 'task-8',
    columnId: 'completed',
    title: 'New Background',
    date: 'Jun 12',
    dashes: ['cyan'],
    coverImage: 'teal-mountain',
    attachmentsCount: 1,
    commentsCount: 2,
    assignees: [mockMembers.jane],
  },
]
