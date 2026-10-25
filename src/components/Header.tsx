import { Bell, ChevronDown, Flower2, Menu, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import profileAvatar from '../assets/profile-avatar.svg'

interface HeaderProps {
  onMenuClick?: () => void
  usePhotoAvatar?: boolean
  showLogo?: boolean
}

export default function Header({ onMenuClick, usePhotoAvatar = false, showLogo = false }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#EDEDED] bg-white px-5">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button type="button" aria-label="Open menu" onClick={onMenuClick} className="text-[#555]">
            <Menu size={19} strokeWidth={1.7} />
          </button>
        )}
        {showLogo && (
          <Link to="/" className="flex items-center gap-2 text-[#282828] no-underline">
            <Flower2 size={19} strokeWidth={1.8} className="text-primary" />
            <span className="text-[14px] font-semibold tracking-[0.12em]">FLOWER</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-5">
        <button type="button" aria-label="Search" className="text-[#696969]">
          <Search size={17} strokeWidth={1.7} />
        </button>
        <button type="button" aria-label="Notifications" className="relative text-[#696969]">
          <Bell size={17} strokeWidth={1.7} />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#E65C5C]" />
        </button>
        <span className="h-6 border-l border-line" />
        <button type="button" className="flex items-center gap-2 text-[12px] font-medium text-[#333]">
          {usePhotoAvatar ? (
            <img src={profileAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E8D8C8] text-[10px] font-medium text-[#765943]">AT</span>
          )}
          <span className="hidden sm:inline">ArtTemplate</span>
          <ChevronDown size={13} className="text-muted" />
        </button>
      </div>
    </header>
  )
}
