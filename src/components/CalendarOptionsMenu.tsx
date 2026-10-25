import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Eye, EyeOff, Settings, Trash2 } from 'lucide-react'
import type { CalendarCategory } from '../types/calendar'
import ColorPalette from './ColorPalette'

interface CalendarOptionsMenuProps {
  category: CalendarCategory
  anchor: HTMLElement
  onDisplayOnly: () => void
  onHide: () => void
  onSettings: () => void
  onDelete: () => void
  onColorChange: (color: string) => void
  onClose: () => void
}

export default function CalendarOptionsMenu({
  category,
  anchor,
  onDisplayOnly,
  onHide,
  onSettings,
  onDelete,
  onColorChange,
  onClose,
}: CalendarOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = useMemo(() => {
    const bounds = anchor.getBoundingClientRect()
    const menuHeight = 204
    const menuWidth = 148
    const left = Math.max(8, Math.min(bounds.left - 8, window.innerWidth - menuWidth - 8))
    const top = bounds.bottom + menuHeight <= window.innerHeight - 8
      ? bounds.bottom
      : Math.max(8, bounds.top - menuHeight)
    return { top, left }
  }, [anchor])

  useEffect(() => {
    menuRef.current?.querySelector<HTMLElement>('[data-menu-focus]')?.focus()
  }, [])

  useEffect(() => {
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !anchor.contains(event.target)) onClose()
    }
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        anchor.focus()
        return
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[data-menu-focus]') ?? [])
      if (!items.length) return
      event.preventDefault()
      const current = items.indexOf(document.activeElement as HTMLElement)
      const increment = event.key === 'ArrowDown' ? 1 : -1
      items[(current + increment + items.length) % items.length].focus()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', keydown)
    }
  }, [anchor, onClose])

  function invoke(action: () => void) {
    action()
    onClose()
  }

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label={`Calendar options for ${category.name}`}
      className="fixed z-[150] w-[148px] rounded-[10px] bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
      style={position}
    >
      <button type="button" role="menuitem" data-menu-focus onClick={() => invoke(onDisplayOnly)} className="flex h-7 w-full items-center gap-2 rounded-lg px-2 text-left text-[11px] text-[#333] hover:bg-[#F3F3F3] focus:bg-[#F3F3F3] focus:outline-none">
        <Eye size={14} className="shrink-0 text-[#888]" /> Display this Only
      </button>
      <button type="button" role="menuitem" data-menu-focus onClick={() => invoke(onHide)} className="flex h-7 w-full items-center gap-2 rounded-lg bg-[#F3F3F3] px-2 text-left text-[11px] text-[#333] focus:outline-none">
        <EyeOff size={14} className="shrink-0 text-[#888]" /> Hide from List
      </button>
      <button type="button" role="menuitem" data-menu-focus onClick={() => invoke(onSettings)} className="flex h-7 w-full items-center gap-2 rounded-lg px-2 text-left text-[11px] text-[#333] hover:bg-[#F3F3F3] focus:bg-[#F3F3F3] focus:outline-none">
        <Settings size={14} className="shrink-0 text-[#888]" /> Settings
      </button>
      <div className="my-1 border-t border-[#EDEDED]" />
      <button type="button" role="menuitem" data-menu-focus onClick={() => invoke(onDelete)} className="flex h-7 w-full items-center gap-2 rounded-lg px-2 text-left text-[11px] text-status-red hover:bg-[#FDECEC] focus:bg-[#FDECEC] focus:outline-none">
        <Trash2 size={14} className="shrink-0" /> Delete Calendar
      </button>
      <div className="my-1 border-t border-[#EDEDED]" />
      <ColorPalette
        value={category.color}
        onChange={(color) => invoke(() => onColorChange(color))}
      />
    </div>,
    document.body,
  )
}
