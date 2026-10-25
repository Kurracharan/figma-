import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import profileAvatar from '../../assets/profile-avatar.svg'

interface TopBarProps {
  onMenuClick?: () => void
  userName?: string
}

export default function TopBar({
  onMenuClick,
  userName = 'ArtTemplate',
}: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#EDEDED] bg-white px-5 sm:px-6">
      {/* Left: Hamburger button */}
      <button
        type="button"
        aria-label="Toggle navigation menu"
        onClick={onMenuClick}
        className="grid h-9 w-9 place-items-center rounded-lg text-[#555] transition-colors hover:bg-gray-100"
      >
        <Menu size={19} strokeWidth={1.8} />
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className="grid h-8 w-8 place-items-center rounded-full text-[#696969] transition-colors hover:bg-gray-100"
        >
          <Search size={17} strokeWidth={1.8} />
        </button>

        {/* Bell with red indicator */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-8 w-8 place-items-center rounded-full text-[#696969] transition-colors hover:bg-gray-100"
        >
          <Bell size={17} strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E5484D] ring-2 ring-white" />
        </button>

        {/* Divider */}
        <span className="h-6 w-px bg-[#EDEDED]" aria-hidden="true" />

        {/* User profile */}
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 text-[12px] font-medium text-[#222222] transition-colors hover:bg-gray-50"
          aria-label="User profile"
        >
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#E8D8C8] text-[11px] font-semibold text-[#765943]">
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            <span>AT</span>
          </span>
          <span className="hidden sm:inline font-medium text-[#333]">{userName}</span>
          <ChevronDown size={14} className="text-[#8A8A8A]" />
        </button>
      </div>
    </header>
  )
}

