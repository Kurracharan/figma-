import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import './menu.css'

export interface MenuTriggerProps {
  ref: Ref<HTMLButtonElement>
  id: string
  type: 'button'
  onClick: () => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  'aria-controls': string
}

interface MenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: (props: MenuTriggerProps) => ReactNode
  children: ReactNode
  width: number
  align?: 'left' | 'right'
  initialFocusRef?: React.RefObject<HTMLElement | null>
  className?: string
}

export function Menu({
  open,
  onOpenChange,
  trigger,
  children,
  width,
  align = 'left',
  initialFocusRef,
  className = '',
}: MenuProps) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const onOpenChangeRef = useRef(onOpenChange)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    onOpenChangeRef.current = onOpenChange
  }, [onOpenChange])

  useEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const bounds = triggerRef.current?.getBoundingClientRect()
      if (!bounds) return
      const left = align === 'right' ? bounds.right - width : bounds.left
      setPosition({
        top: bounds.bottom + 8,
        left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
      })
    }
    const close = (returnFocus = true) => {
      onOpenChangeRef.current(false)
      if (returnFocus) window.setTimeout(() => triggerRef.current?.focus(), 0)
    }
    updatePosition()
    const focusTarget = initialFocusRef?.current ??
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
    const focusTimer = window.setTimeout(() => focusTarget?.focus(), 0)
    const reposition = () => updatePosition()
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Node &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close()
      }
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, initialFocusRef, align, width])

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      ) ?? []
    )
    const index = items.indexOf(document.activeElement as HTMLElement)
    let nextIndex: number | undefined

    if (event.key === 'ArrowDown') nextIndex = index < 0 ? 0 : (index + 1) % items.length
    if (event.key === 'ArrowUp') nextIndex = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1

    if (nextIndex !== undefined && items.length > 0) {
      event.preventDefault()
      items[nextIndex]?.focus()
    }
  }

  const renderedTrigger = trigger({
    ref: triggerRef,
    id: `${id}-trigger`,
    type: 'button',
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': `${id}-menu`,
    onClick: () => onOpenChange(!open),
    onKeyDown: (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        onOpenChange(true)
      }
    },
  })

  return (
    <>
      {renderedTrigger}
      {open && createPortal(
        <div
          ref={menuRef}
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          onKeyDown={handleMenuKeyDown}
          className={`task-menu-panel fixed z-[100] max-h-[min(75vh,520px)] overflow-y-auto rounded-xl border border-task-border bg-white p-2 text-[14px] text-ink shadow-lg shadow-gray-900/10 ${className}`}
          style={{ top: position.top, left: position.left, width }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  )
}

interface MenuItemProps {
  children: ReactNode
  icon?: ReactNode
  onSelect?: () => void
  onMouseEnter?: () => void
  disabled?: boolean
  destructive?: boolean
  trailing?: ReactNode
  className?: string
  selected?: boolean
}

export function MenuItem({
  children,
  icon,
  onSelect,
  onMouseEnter,
  disabled = false,
  destructive = false,
  trailing,
  className = '',
  selected,
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      aria-checked={selected}
      tabIndex={-1}
      disabled={disabled}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-[14px] transition-colors ${
        disabled
          ? 'cursor-not-allowed text-gray-300'
          : destructive
            ? 'text-red-600 hover:bg-red-50'
            : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
      } ${className}`}
    >
      {icon && <span className={`grid w-4 shrink-0 place-items-center ${destructive ? 'text-red-500' : 'text-muted'}`}>{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing}
    </button>
  )
}

export function MenuDivider() {
  return <div role="separator" className="my-1 h-px bg-gray-200" />
}

export function MenuHeading({ children }: { children: ReactNode }) {
  return <div className="px-2 pb-1 pt-1 text-[13px] font-medium text-ink">{children}</div>
}
