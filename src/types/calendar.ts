export type CalendarCategoryId = string
export type CalendarView = 'Month' | 'Week' | 'Day'

export interface CalendarCategory {
  id: CalendarCategoryId
  name: string
  color: string
  visible: boolean
  hiddenFromList: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  time: string
  endTime?: string
  categoryId: CalendarCategoryId
  description?: string
  allDay?: boolean
  repeat?: boolean
}

export const CALENDAR_COLORS = [
  { name: 'Coral', hex: '#F87171' },
  { name: 'Teal', hex: '#3CCFBF' },
  { name: 'Yellow', hex: '#FFC83D' },
  { name: 'Dark green', hex: '#1E8E2E' },
  { name: 'Cyan', hex: '#22D3EE' },
  { name: 'Green', hex: '#34D399' },
  { name: 'Lime', hex: '#A8E04A' },
  { name: 'Purple', hex: '#B14EF0' },
  { name: 'Pink', hex: '#FF7ADB' },
  { name: 'Light gray', hex: '#6B7280' },
] as const

export function getCategoryStyle(color: string) {
  const hex = color.replace('#', '')
  const normalized = hex.length === 3
    ? hex.split('').map((part) => part + part).join('')
    : hex
  const value = Number.parseInt(normalized, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return { strong: color, pale: `rgba(${red}, ${green}, ${blue}, 0.2)` }
}

export const INITIAL_CALENDAR_CATEGORIES: CalendarCategory[] = [
  { id: 'important', name: 'Important', color: '#F87171', visible: true, hiddenFromList: false },
  { id: 'meeting', name: 'Meeting', color: '#22D3EE', visible: true, hiddenFromList: false },
  { id: 'event', name: 'Event', color: '#34D399', visible: true, hiddenFromList: false },
  { id: 'work', name: 'Work', color: '#FACC15', visible: true, hiddenFromList: false },
  { id: 'other', name: 'Other', color: '#6B7280', visible: true, hiddenFromList: false },
]

export const CALL_CATEGORY_ID = 'call'
export const CALL_CATEGORY_COLOR = '#3CCFBF'
export const MOCK_TODAY = new Date(2020, 8, 8)

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'call-priscilla',
    title: 'Call Back Priscilla',
    start: '2020-09-01',
    end: '2020-09-03',
    time: '00:30',
    endTime: '01:30',
    categoryId: 'important',
    description: 'Give Priscilla a call to follow up and talk through the latest project updates.',
  },
  { id: 'meeting-judith', title: 'Meeting with Judith', start: '2020-09-09', end: '2020-09-10', time: '10:00', categoryId: 'meeting' },
  { id: 'meeting-team', title: 'Meeting with the team', start: '2020-09-09', end: '2020-09-09', time: '10:00', categoryId: 'meeting' },
  { id: 'rocket-project', title: "Project 'Rocket'", start: '2020-09-14', end: '2020-09-16', time: '10:00', categoryId: 'work' },
  ...Array.from({ length: 5 }, (_, index) => ({
    id: `work-overflow-${index + 1}`,
    title: 'New Event',
    start: '2020-09-16',
    end: '2020-09-16',
    time: '10:00',
    categoryId: 'work',
  })),
  { id: 'presentation-a', title: 'Presentation', start: '2020-09-24', end: '2020-09-26', time: '10:00', categoryId: 'event' },
  { id: 'presentation-b', title: 'Presentation', start: '2020-09-24', end: '2020-09-25', time: '10:00', categoryId: 'event' },
]
