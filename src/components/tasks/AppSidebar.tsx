import {
  CalendarDays,
  ChevronRight,
  Contact,
  Flower2,
  Folder,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessageCircle,
  NotebookPen,
  Search,
  ShoppingBag,
  ListTodo,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AppSidebar({ isOpen = false, onClose }: AppSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isTaskActive = currentPath === '/tasks' || currentPath === '/task' || currentPath === '/task-board'

  const navClass =
    'flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[11px] font-medium text-[#696969] transition-colors hover:bg-[#F7F7F7] hover:text-[#333]'

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation sidebar"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`${
          isOpen ? 'fixed inset-y-0 left-0 z-50 flex shadow-2xl' : 'hidden lg:flex'
        } w-[190px] shrink-0 flex-col border-r border-[#EDEDED] bg-white px-3.5 pb-4 pt-5 lg:static lg:z-auto lg:shadow-none`}
        aria-label="Application sidebar"
      >
        {/* Logo plus "FLOWER" wordmark */}
        <Link
          to="/"
          className="mb-5 flex items-center gap-2 px-1 text-[#282828] no-underline"
        >
          <Flower2 size={20} strokeWidth={2} className="text-task-primary" />
          <span className="text-[14px] font-bold tracking-[0.14em] text-[#222]">
            FLOWER
          </span>
        </Link>

        {/* Rounded search input "Search anything" */}
        <div className="relative mb-5">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#969696]"
          />
          <input
            type="text"
            placeholder="Search anything"
            aria-label="Search anything"
            className="h-8 w-full rounded-lg border-0 bg-[#F5F5F5] pl-8 pr-2 text-[10px] text-[#222] outline-none placeholder:text-[#A0A0A0] focus:ring-1 focus:ring-task-primary/30"
          />
        </div>

        {/* "MAIN MENU" label */}
        <p className="mb-2 px-1 text-[9px] font-bold tracking-[0.1em] text-[#A0A0A0] uppercase">
          MAIN MENU
        </p>

        {/* Navigation items */}
        <nav className="flex flex-col gap-0.5">
          {/* Dashboard */}
          <Link to="/dashboard" className={navClass}>
            <LayoutDashboard size={15} strokeWidth={1.8} />
            <span>Dashboard</span>
          </Link>

          {/* E-Commerce with right chevron */}
          <Link to="/products" className={`${navClass} justify-between`}>
            <span className="flex items-center gap-2.5">
              <ShoppingBag size={15} strokeWidth={1.8} />
              <span>E-Commerce</span>
            </span>
            <ChevronRight size={13} className="text-[#999]" />
          </Link>

          {/* Calendar */}
          <Link to="/calendar" className={navClass}>
            <CalendarDays size={15} strokeWidth={1.8} />
            <span>Calendar</span>
          </Link>

          {/* Mail with red badge "8" */}
          <Link to="/mail" className={`${navClass} justify-between`}>
            <span className="flex items-center gap-2.5">
              <Mail size={15} strokeWidth={1.8} />
              <span>Mail</span>
            </span>
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-chat-badge-red px-1 text-[9px] font-bold text-white shadow-2xs">
              8
            </span>
          </Link>

          {/* Chat */}
          <Link to="/chat" className={navClass}>
            <MessageCircle size={15} strokeWidth={1.8} />
            <span>Chat</span>
          </Link>

          {/* Task (ACTIVE) */}
          <div className="relative">
            {isTaskActive && (
              <span className="absolute -left-3.5 top-1 bottom-1 w-[3.5px] rounded-r-md bg-[#176D25]" />
            )}
            <Link
              to="/tasks"
              aria-current={isTaskActive ? 'page' : undefined}
              className={`flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[11px] no-underline transition-colors ${
                isTaskActive
                  ? 'bg-[#BDEB8B] font-bold text-[#1F8A3B] shadow-2xs'
                  : 'font-medium text-[#696969] hover:bg-[#F7F7F7]'
              }`}
            >
              <ListTodo size={15} strokeWidth={2} />
              <span>Task</span>
            </Link>
          </div>

          {/* Projects */}
          <Link to="/tasks" className={navClass}>
            <FolderKanban size={15} strokeWidth={1.8} />
            <span>Projects</span>
          </Link>

          {/* File Manager */}
          <Link to="/dashboard" className={navClass}>
            <Folder size={15} strokeWidth={1.8} />
            <span>File Manager</span>
          </Link>

          {/* Notes */}
          <Link to="/dashboard" className={navClass}>
            <NotebookPen size={15} strokeWidth={1.8} />
            <span>Notes</span>
          </Link>

          {/* Contacts */}
          <Link to="/dashboard" className={navClass}>
            <Contact size={15} strokeWidth={1.8} />
            <span>Contacts</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}

