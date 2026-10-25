import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  Flower2,
  Folder,
  Layers,
  LayoutDashboard,
  Mail,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface IconSidebarProps {
  activeItem?: string
}

export default function IconSidebar({ activeItem = 'chat' }: IconSidebarProps) {
  const navItems = [
    { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cart', href: '/products', label: 'Cart', icon: ShoppingBag },
    { id: 'calendar', href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'mail', href: '/mail', label: 'Mail', icon: Mail },
    {
      id: 'chat',
      href: '/chat',
      label: 'Chat',
      icon: MessageCircle,
      badge: '8',
    },
    { id: 'clipboard', href: '/dashboard', label: 'Tasks', icon: ClipboardList },
    { id: 'layers', href: '/dashboard', label: 'Layers', icon: Layers },
    { id: 'folder', href: '/dashboard', label: 'Folder', icon: Folder },
    { id: 'document', href: '/dashboard', label: 'Document', icon: FileText },
    { id: 'book', href: '/dashboard', label: 'Book', icon: BookOpen },
  ]

  return (
    <nav
      className="flex w-[56px] shrink-0 flex-col items-center border-r border-[#EDEDED] bg-white py-4"
      aria-label="Application navigation rail"
    >
      {/* App Logo */}
      <Link
        to="/"
        className="mb-6 grid h-9 w-9 place-items-center rounded-lg text-[#1F8A3B] transition-colors hover:bg-emerald-50"
        aria-label="FLOWER Home"
      >
        <Flower2 size={22} strokeWidth={2} />
      </Link>

      {/* Nav Icons */}
      <div className="flex w-full flex-1 flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeItem

          return (
            <Link
              key={item.id}
              to={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative grid h-10 w-10 place-items-center rounded-xl transition-all ${
                isActive
                  ? 'bg-chat-teal-bg text-chat-primary font-medium shadow-sm'
                  : 'text-[#8A8A8A] hover:bg-[#F7F7F7] hover:text-[#333]'
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />

              {/* Unread Badge (e.g. red badge 8 for chat) */}
              {item.badge && (
                <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-chat-badge-red px-1 text-[10px] font-bold text-white shadow-xs">
                  {item.badge}
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute -left-[8px] top-2 bottom-2 w-1 rounded-r-md bg-chat-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

