import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Contact,
  Folder,
  LayoutDashboard,
  Mail,
  MessageCircle,
  NotebookPen,
  Search,
  ShoppingBag,
  ListTodo,
  Flower2,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import CalendarFilters from './CalendarFilters'
import type { CalendarCategory } from '../types/calendar'

interface SidebarProps {
  calendarActive?: boolean
  isOpen?: boolean
  onClose?: () => void
  calendars?: CalendarCategory[]
  onToggleCalendar?: (categoryId: string) => void
  onDisplayCalendarOnly?: (categoryId: string) => void
  onHideCalendar?: (categoryId: string) => void
  onRestoreHiddenCalendars?: () => void
  onRenameCalendar?: (categoryId: string, name: string) => void
  onCalendarColorChange?: (categoryId: string, color: string) => void
  onDeleteCalendar?: (categoryId: string) => void
  calendarEventCount?: (categoryId: string) => number
}

const navClass =
  'flex h-8 items-center gap-3 rounded-md px-2 text-[11px] text-[#696969] hover:bg-[#F7F7F7]'

export default function Sidebar({
  calendarActive = false,
  isOpen = false,
  onClose,
  calendars = [],
  onToggleCalendar,
  onDisplayCalendarOnly,
  onHideCalendar,
  onRestoreHiddenCalendars,
  onRenameCalendar,
  onCalendarColorChange,
  onDeleteCalendar,
  calendarEventCount,
}: SidebarProps) {
  const location = useLocation()
  const ordersActive = location.pathname === '/e-commerce/orders'
  const customersActive = location.pathname === '/e-commerce/customers'
  const productsActive = location.pathname === '/' || location.pathname === '/products'
  const isCalendarPage = calendarActive || location.pathname === '/calendar'
  const isMailPage = location.pathname === '/mail'
  const isChatPage = location.pathname === '/chat'
  const isTaskPage = location.pathname === '/tasks' || location.pathname === '/task' || location.pathname === '/task-board'
  const commerceActive = !isCalendarPage && !isMailPage && !isChatPage && !isTaskPage

  return (
    <>
      {isOpen && <button type="button" aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}
    <aside className={`${isOpen ? 'fixed inset-y-0 left-0 z-50 flex shadow-xl' : 'hidden lg:flex'} w-calendar-sidebar shrink-0 flex-col border-r border-[#EDEDED] bg-white px-3 pb-4 pt-5 lg:static lg:z-auto lg:shadow-none`}>
      <Link to="/" className="mb-6 flex items-center gap-2 px-1 text-[#282828] no-underline">
        <Flower2 size={19} strokeWidth={1.8} className="text-primary" />
        <span className="text-[14px] font-semibold tracking-[0.12em]">FLOWER</span>
      </Link>
      <label className="relative mb-6 block">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#969696]" />
        <input
          aria-label="Search anything"
          placeholder="Search anything"
          className="h-8 w-full rounded-lg border-0 bg-[#F5F5F5] pl-8 pr-2 text-[10px] text-ink outline-none placeholder:text-[#A0A0A0] focus:ring-1 focus:ring-[#D5EACB]"
        />
      </label>
      <p className="mb-2 px-2 text-[9px] font-medium tracking-[0.09em] text-[#A0A0A0]">MAIN MENU</p>
      <nav className="flex flex-col gap-0.5">
        <Link to="/dashboard" className={navClass}>
          <LayoutDashboard size={15} strokeWidth={1.7} />
          <span>Dashboard</span>
        </Link>
        <div className="relative">
          {commerceActive && <span className="absolute -left-3 top-0 h-8 w-[3px] rounded-r bg-[#176D25]" />}
          <button
            type="button"
            className={`flex h-8 w-full items-center justify-between rounded-md px-2 text-[11px] ${
              commerceActive ? 'bg-light-green font-medium text-[#2C5B28]' : 'text-[#696969] hover:bg-[#F7F7F7]'
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag size={15} strokeWidth={1.8} />
              E-Commerce
            </span>
            {isCalendarPage ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
        {!isCalendarPage && <div className="mb-1 ml-[29px] flex flex-col gap-0.5">
          <Link
            to="/products"
            aria-current={productsActive ? 'page' : undefined}
            className={`flex h-7 items-center gap-2 rounded-md px-2 text-[10px] no-underline ${
              productsActive ? 'bg-pale-green font-medium text-[#333]' : 'text-[#777]'
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${productsActive ? 'bg-[#2D722A]' : 'bg-[#B8B8B8]'}`} />
            Products
          </Link>
          <Link
            to="/e-commerce/orders"
            aria-current={ordersActive ? 'page' : undefined}
            className={`flex h-7 items-center gap-2 rounded-md px-2 text-[10px] no-underline ${
              ordersActive ? 'bg-pale-green font-medium text-[#333]' : 'text-[#777]'
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${ordersActive ? 'bg-[#2D722A]' : 'bg-[#B8B8B8]'}`} />
            Orders
          </Link>
          <Link
            to="/e-commerce/customers"
            aria-current={customersActive ? 'page' : undefined}
            className={`flex h-7 items-center gap-2 rounded-md px-2 text-[10px] no-underline ${
              customersActive ? 'bg-pale-green font-medium text-[#333]' : 'text-[#777]'
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${customersActive ? 'bg-[#2D722A]' : 'bg-[#B8B8B8]'}`} />
            Customers
          </Link>
        </div>}
        <div className="relative">
          {isCalendarPage && <span className="absolute -left-3 top-0 h-8 w-[3px] rounded-r bg-[#176D25]" />}
          <Link
            to="/calendar"
            aria-current={isCalendarPage ? 'page' : undefined}
            className={`flex h-8 items-center gap-3 rounded-md px-2 text-[11px] no-underline ${
              isCalendarPage ? 'bg-light-green font-medium text-[#2C5B28]' : 'text-[#696969] hover:bg-[#F7F7F7]'
            }`}
          >
          <CalendarDays size={15} strokeWidth={1.7} />
            <span className="flex-1 text-left">Calendar</span>
          </Link>
        </div>
        <Link to="/mail" aria-current={isMailPage ? 'page' : undefined} className={`${navClass} no-underline ${
          isMailPage ? 'bg-light-green font-medium text-[#2C5B28]' : ''
        }`}>
          <Mail size={15} strokeWidth={1.7} />
          <span className="flex-1 text-left">Mail</span>
          <span className="grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#E55D5D] px-1 text-[9px] text-white">{isCalendarPage ? '8' : '6'}</span>
        </Link>
        <div className="relative">
          {isChatPage && <span className="absolute -left-3 top-0 h-8 w-[3px] rounded-r bg-[#176D25]" />}
          <Link to="/chat" aria-current={isChatPage ? 'page' : undefined} className={`${navClass} no-underline ${
            isChatPage ? 'bg-light-green font-medium text-[#2C5B28]' : ''
          }`}>
            <MessageCircle size={15} strokeWidth={1.7} />
            <span>Chat</span>
          </Link>
        </div>
        <div className="relative">
          {isTaskPage && <span className="absolute -left-3 top-0 h-8 w-[3px] rounded-r bg-[#176D25]" />}
          <Link
            to="/tasks"
            aria-current={isTaskPage ? 'page' : undefined}
            className={`${navClass} no-underline ${
              isTaskPage ? 'bg-light-green font-medium text-[#2C5B28]' : ''
            }`}
          >
            <ListTodo size={15} strokeWidth={1.7} />
            <span>Task</span>
          </Link>
        </div>
        <button type="button" className={navClass}>
          <Folder size={15} strokeWidth={1.7} />
          <span>File Manager</span>
        </button>
        <button type="button" className={navClass}>
          <NotebookPen size={15} strokeWidth={1.7} />
          <span>Notes</span>
        </button>
        <button type="button" className={navClass}>
          <Contact size={15} strokeWidth={1.7} />
          <span>Contacts</span>
        </button>
      </nav>
      {isCalendarPage && onToggleCalendar && onDisplayCalendarOnly && onHideCalendar &&
        onRestoreHiddenCalendars && onRenameCalendar && onCalendarColorChange && onDeleteCalendar && calendarEventCount && (
        <CalendarFilters
          categories={calendars}
          hiddenCount={calendars.filter((category) => category.hiddenFromList).length}
          onToggle={onToggleCalendar}
          onDisplayOnly={onDisplayCalendarOnly}
          onHide={onHideCalendar}
          onRestoreHidden={onRestoreHiddenCalendars}
          onRename={onRenameCalendar}
          onColorChange={onCalendarColorChange}
          onDelete={onDeleteCalendar}
          eventCount={calendarEventCount}
        />
      )}
    </aside>
    </>
  )
}
