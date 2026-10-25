import { useState } from 'react'
import { MoreVertical, Plus } from 'lucide-react'
import type { CalendarCategory } from '../types/calendar'
import CalendarOptionsMenu from './CalendarOptionsMenu'
import CalendarSettingsModal from './CalendarSettingsModal'
import ConfirmDialog from './ConfirmDialog'

interface CalendarFiltersProps {
  categories: CalendarCategory[]
  hiddenCount: number
  onToggle: (categoryId: string) => void
  onDisplayOnly: (categoryId: string) => void
  onHide: (categoryId: string) => void
  onRestoreHidden: () => void
  onRename: (categoryId: string, name: string) => void
  onColorChange: (categoryId: string, color: string) => void
  onDelete: (categoryId: string) => void
  eventCount: (categoryId: string) => number
}

export default function CalendarFilters({
  categories,
  hiddenCount,
  onToggle,
  onDisplayOnly,
  onHide,
  onRestoreHidden,
  onRename,
  onColorChange,
  onDelete,
  eventCount,
}: CalendarFiltersProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [settingsCategory, setSettingsCategory] = useState<CalendarCategory | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<CalendarCategory | null>(null)
  const shownCategories = categories.filter((category) => !category.hiddenFromList)

  function toggleMenu(category: CalendarCategory, button: HTMLButtonElement) {
    if (openCategory === category.id) {
      setOpenCategory(null)
      setAnchor(null)
    } else {
      setAnchor(button)
      setOpenCategory(category.id)
    }
  }

  return (
    <section className="relative z-20 mt-5">
      <div className="mb-1 flex items-center justify-between px-2">
        <h2 className="m-0 text-[9px] font-medium tracking-[0.09em] text-[#A0A0A0]">CALENDARS</h2>
        <button type="button" aria-label="Add calendar" className="grid h-5 w-5 place-items-center rounded-full bg-[#F3F3F3] text-[#777]">
          <Plus size={12} />
        </button>
      </div>
      {shownCategories.map((category) => (
        <div
          key={category.id}
          className={`group relative flex h-8 items-center rounded-md px-2 text-[11px] text-[#555] ${
            openCategory === category.id ? 'z-30' : 'z-0'
          }`}
        >
          <input
            id={`calendar-${category.id}`}
            type="checkbox"
            checked={category.visible}
            onChange={() => onToggle(category.id)}
            className="h-[14px] w-[14px] cursor-pointer rounded-[3px] border border-[#D6D6D6] focus:ring-2 focus:ring-[#B9EE8E]"
            style={{ accentColor: category.color }}
          />
          <label htmlFor={`calendar-${category.id}`} className="ml-2 min-w-0 flex-1 cursor-pointer truncate">
            {category.name}
          </label>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={openCategory === category.id}
            aria-label={`Calendar options for ${category.name}`}
            onClick={(event) => toggleMenu(category, event.currentTarget)}
            className={`grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded text-[#8A8A8A] hover:bg-[#F3F3F3] focus:bg-[#F3F3F3] focus:outline-none ${
              openCategory === category.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
            }`}
          >
            <MoreVertical size={14} />
          </button>
        </div>
      ))}
      {hiddenCount > 0 && (
        <button type="button" onClick={onRestoreHidden} className="ml-2 mt-1 text-[11px] text-[#8A8A8A] underline-offset-2 hover:underline">
          Show hidden ({hiddenCount})
        </button>
      )}

      {openCategory && anchor && (() => {
        const category = categories.find((item) => item.id === openCategory)
        if (!category) return null
        return (
          <CalendarOptionsMenu
            category={category}
            anchor={anchor}
            onDisplayOnly={() => onDisplayOnly(category.id)}
            onHide={() => onHide(category.id)}
            onSettings={() => setSettingsCategory(category)}
            onDelete={() => setDeleteCategory(category)}
            onColorChange={(color) => onColorChange(category.id, color)}
            onClose={() => {
              setOpenCategory(null)
              setAnchor(null)
            }}
          />
        )
      })()}

      {settingsCategory && (
        <CalendarSettingsModal
          key={`${settingsCategory.id}-${settingsCategory.name}-${settingsCategory.color}`}
          category={categories.find((item) => item.id === settingsCategory.id) ?? settingsCategory}
          onClose={() => setSettingsCategory(null)}
          onSave={(name, color) => {
            onRename(settingsCategory.id, name)
            onColorChange(settingsCategory.id, color)
            setSettingsCategory(null)
          }}
        />
      )}
      {deleteCategory && (
        <ConfirmDialog
          calendarName={deleteCategory.name}
          eventCount={eventCount(deleteCategory.id)}
          onCancel={() => setDeleteCategory(null)}
          onConfirm={() => {
            onDelete(deleteCategory.id)
            setDeleteCategory(null)
          }}
        />
      )}
    </section>
  )
}
