type IconName =
  | 'grid'
  | 'chart'
  | 'bag'
  | 'users'
  | 'settings'
  | 'help'
  | 'search'
  | 'bell'
  | 'calendar'
  | 'download'
  | 'arrow-up'
  | 'arrow-down'
  | 'more'
  | 'wallet'
  | 'orders'
  | 'credit-card'
  | 'plus'
  | 'close'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'filter'
  | 'check'
  | 'chevrons-left'
  | 'chevrons-right'
  | 'export'
  | 'mail'
  | 'chat'
  | 'task'
  | 'file-manager'
  | 'notes'
  | 'contacts'
  | 'menu'

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

function Icon({ name, size = 18, className }: IconProps) {
  const paths: Record<IconName, string> = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    chart: 'M4 19V5M4 19h17M8 15l3-4 3 2 5-7',
    bag: 'M5 8h14l1 12H4L5 8zM8 8a4 4 0 0 1 8 0',
    users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 1 0 0-6M17 15h1a4 4 0 0 1 4 4v1',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.5v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.5-1H6.5v-2.5h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1z',
    help: 'M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-.9 1-1.9 1.3-1.9 2.9M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    search: 'm20 20-4.5-4.5M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    calendar: 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2zM8 2v4M16 2v4M3 10h18',
    download: 'M12 3v12M7 10l5 5 5-5M4 21h16',
    'arrow-up': 'M5 15l6-6 4 4 4-6M15 7h4v4',
    'arrow-down': 'M5 9l6 6 4-4 4 6M15 17h4v-4',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    wallet: 'M3 7a2 2 0 0 1 2-2h14v14H5a2 2 0 0 1-2-2V7zM3 8h18v4h-5a2 2 0 0 1 0-4h5M16 10h.01',
    orders: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
    'credit-card': 'M3 6h18v12H3zM3 10h18M7 15h3',
    plus: 'M12 5v14M5 12h14',
    close: 'M6 6l12 12M18 6L6 18',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
    'chevron-left': 'M15 18l-6-6 6-6',
    filter: 'M4 6h16M7 12h10M10 18h4',
    check: 'M20 6L9 17l-5-5',
    'chevrons-left': 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
    'chevrons-right': 'M13 17l5-5-5-5M6 17l5-5-5-5',
    export: 'M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 8l-4-4-4 4M12 4v12',
    mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
    chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    task: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    'file-manager': 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    notes: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
    contacts: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    menu: 'M3 12h18M3 6h18M3 18h18',
  }

  return (
    <svg
      aria-hidden="true"
      className={`icon ${className || ''}`.trim()}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={paths[name]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

export default Icon
