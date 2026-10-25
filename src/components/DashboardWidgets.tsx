import { useState } from 'react'

type IconName = 'settings' | 'activity' | 'users' | 'search' | 'bell' | 'chevron' | 'calendar' | 'more' | 'up' | 'down'

function Icon({ name, className = 'icon' }: { name: IconName; className?: string }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  switch (name) {
    case 'settings': return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.08-.03a1.7 1.7 0 0 0-1.78.27l-.08.07h-3.4l-.04-.08a1.7 1.7 0 0 0-2.4-.77l-.08.05-2.94-1.7.03-.08a1.7 1.7 0 0 0-.27-1.78l-.07-.08v-3.4l.08-.04a1.7 1.7 0 0 0 .77-2.4l-.05-.08 1.7-2.94.08.03a1.7 1.7 0 0 0 1.78-.27l.08-.07h3.4l.04.08a1.7 1.7 0 0 0 2.4.77l.08-.05 2.94 1.7-.03.08a1.7 1.7 0 0 0 .27 1.78l.07.08v3.4Z" /></svg>
    case 'activity': return <svg {...common}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>
    case 'users': return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    case 'search': return <svg {...common}><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4.2 4.2" /></svg>
    case 'bell': return <svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>
    case 'chevron': return <svg {...common}><path d="m7 10 5 5 5-5" /></svg>
    case 'calendar': return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
    case 'more': return <svg {...common}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>
    case 'up': return <svg {...common}><path d="m7 14 5-5 5 5" /><path d="M12 9v10" /></svg>
    case 'down': return <svg {...common}><path d="m7 10 5 5 5-5" /><path d="M12 5v10" /></svg>
  }
}

function Avatar({ id, name, className = '' }: { id: number; name: string; className?: string }) {
  return <img className={`avatar ${className}`} src={`https://i.pravatar.cc/120?img=${id}`} alt={name} />
}

const favorites = [
  ['Ronald Robertson', 'Product Designer', 12],
  ['Regina Cooper', 'Project Manager', 47],
  ['Judith Black', 'Business Analyst', 44],
  ['Dustin Williamson', 'Web Developer', 13],
  ['Calvin Flores', 'Senior Vice President', 68],
] as const

export function ProfileSidebar() {
  return (
    <aside className="profile-sidebar">
      <div className="profile-intro">
        <h1>Felicia Brown</h1>
        <p>Project Manager</p>
        <button className="edit-profile" type="button">Edit profile</button>
      </div>
      <section className="sidebar-section info-section">
        <h2>INFO</h2>
        <dl className="info-list">
          <div><dt>EMAIL</dt><dd>example@mail.com</dd></div>
          <div><dt>PHONE</dt><dd>+123–4567–8800</dd></div>
          <div><dt>BIRTHDAY</dt><dd>17 March, 1995</dd></div>
          <div><dt>LOCATION</dt><dd>New York, NY</dd></div>
        </dl>
      </section>
      <section className="sidebar-section favorites-section">
        <h2>FAVORITES</h2>
        <div className="favorites-list">
          {favorites.map(([name, role, image]) => (
            <div className="favorite-person" key={name}>
              <Avatar id={image} name={name} />
              <div><strong>{name}</strong><span>{role}</span></div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

export function TopHeader() {
  return (
    <header className="top-header">
      <nav className="top-nav" aria-label="Dashboard sections">
        <button className="active" type="button"><Icon name="settings" />Settings</button>
        <button type="button"><Icon name="activity" />Activity</button>
        <button type="button"><Icon name="users" />Users</button>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Search"><Icon name="search" /></button>
        <button className="icon-button notification-button" type="button" aria-label="Notifications"><Icon name="bell" /></button>
        <button className="account-button" type="button">
          <span>ArtTemplate</span><Icon name="chevron" />
        </button>
      </div>
    </header>
  )
}

export function StatCard({ label, value, change, direction }: { label: string; value: string; change: string; direction: 'up' | 'down' }) {
  const positive = direction === 'up'
  return (
    <article className="stat-card">
      <div className="stat-topline"><span>{label}</span><span className={`trend-icon ${positive ? 'positive' : 'negative'}`}><Icon name={direction} /></span></div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${positive ? 'positive' : 'negative'}`}><Icon name={direction} />{change}</div>
    </article>
  )
}

function DateButton() {
  return <button className="date-button" type="button"><Icon name="calendar" />19 Aug – 25 Aug<Icon name="chevron" /></button>
}

export function VisitsChart() {
  const horizontal = [34, 73, 112, 151, 190]
  const values = [
    [77, 139], [172, 119], [267, 131], [362, 86], [457, 112], [552, 45], [647, 75],
  ]
  const line = values.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ')
  const area = `${line} L 647 194 L 77 194 Z`
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <article className="panel visits-panel">
      <div className="panel-heading"><h2>Visits</h2><DateButton /></div>
      <div className="visits-summary">
        <div className="summary-stat"><strong>↓ 1.400</strong><span>Min. Visits</span></div>
        <div className="summary-stat"><strong>— 3.100</strong><span>Avg. Visits</span></div>
        <div className="summary-stat"><strong>↑ 9.500</strong><span>Max. Visits</span></div>
      </div>
      <div className="visits-chart">
        <svg viewBox="0 0 690 225" preserveAspectRatio="none" role="img" aria-label="Visits from Monday to Sunday">
          <defs><linearGradient id="visit-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7bd3a2" stopOpacity=".27" /><stop offset="100%" stopColor="#7bd3a2" stopOpacity=".015" /></linearGradient></defs>
          {horizontal.map((y, index) => <g key={y}><line className="chart-grid-line" x1="40" x2="675" y1={y} y2={y} /><text className="chart-y-label" x="0" y={y + 3}>{['10k', '7.5k', '5k', '2.5k', '0'][index]}</text></g>)}
          <path d={area} fill="url(#visit-area)" />
          <path className="visits-line" d={line} transform="translate(0 4)" />
          {values.map(([x, y], index) => <circle className="visits-point" key={x} cx={x} cy={y + 4} r="3.5"><title>{days[index]}: {['2.4k', '4.1k', '3.7k', '6.2k', '5.1k', '8.7k', '7.4k'][index]} visits</title></circle>)}
          {days.map((day, index) => <text className="chart-x-label" key={day} x={77 + index * 95} y="218" textAnchor="middle">{day}</text>)}
        </svg>
        <div className="chart-tooltip"><strong>21 Aug</strong>3.100 visits</div>
      </div>
    </article>
  )
}

const networks = [
  ['Facebook', '3.5k', '#43b77d'], ['Twitter', '7.8k', '#61c7b1'], ['Instagram', '5.8k', '#91d8a9'], ['YouTube', '4.7k', '#d0ead9'],
] as const

export function FollowersCard() {
  return (
    <article className="panel followers-panel">
      <div className="panel-heading"><h2>Followers</h2><button className="icon-button" type="button" aria-label="More follower options"><Icon name="more" /></button></div>
      <div className="donut-wrap"><div className="donut-center"><strong>21.800</strong><span>Total</span></div></div>
      <div className="social-legend">
        {networks.map(([name, count, color]) => <div key={name}><span className="social-label"><i className="social-dot" style={{ backgroundColor: color }} />{name}</span><strong>{count}</strong></div>)}
      </div>
    </article>
  )
}

const growthData = [
  { day: 'Mon', current: 46, previous: 42 }, { day: 'Tue', current: 69, previous: 52 }, { day: 'Wed', current: 56, previous: 48 },
  { day: 'Thu', current: 83, previous: 63 }, { day: 'Fri', current: 64, previous: 54 }, { day: 'Sat', current: 74, previous: 61 }, { day: 'Sun', current: 91, previous: 70 },
]

export function FollowersGrowth() {
  return (
    <article className="panel growth-panel">
      <div className="panel-heading"><h2>Followers Growth</h2><DateButton /></div>
      <div className="growth-summary">
        <div className="summary-stat"><strong>↑ 21.800</strong><span>Current Week</span></div>
        <div className="summary-stat"><strong>↓ 19.400</strong><span>Last Week</span></div>
      </div>
      <div className="growth-chart">
        <div className="growth-y-labels"><span>10k</span><span>7.5k</span><span>5k</span><span>2.5k</span><span>0</span></div>
        <div className="growth-plot">
          {growthData.map(({ day, current, previous }) => <div className="growth-day" key={day}>
            <div className="bar-pair"><i className="growth-bar previous" style={{ height: `${previous}%` }} /><i className="growth-bar" style={{ height: `${current}%` }} /></div>
            <span>{day}</span>
          </div>)}
        </div>
      </div>
      <div className="growth-legend"><span><i className="legend-swatch" />Current Week</span><span><i className="legend-swatch previous" />Last Week</span></div>
    </article>
  )
}

const recommended = [
  ['Devon Williamson', 'Product Designer, Apple Inc', 12],
  ['Debra Wilson', 'Project Manager, Facebook Inc', 44],
  ['Judith Black', 'Business Analyst, Google Inc', 47],
  ['Philip Henry', 'Web Developer, Google Inc', 13],
  ['Mitchell Cooper', 'Senior Vice President, Amazon Inc', 68],
] as const

export function NewFollowers() {
  const [followed, setFollowed] = useState<string[]>([])
  return (
    <article className="panel new-followers-panel">
      <div className="panel-heading"><h2>New Followers</h2><DateButton /></div>
      <div className="new-follower-list">
        {recommended.map(([name, role, image]) => {
          const isFollowed = followed.includes(name)
          return <div className="new-follower-row" key={name}>
            <Avatar id={image} name={name} />
            <div className="follower-copy"><strong>{name}</strong><span>{role}</span></div>
            <button className={`follow-button ${isFollowed ? 'following' : ''}`} type="button" onClick={() => setFollowed((current) => isFollowed ? current.filter((person) => person !== name) : [...current, name])}>{isFollowed ? 'Following' : 'Follow'}</button>
            <button className="icon-button row-menu" type="button" aria-label={`More options for ${name}`}><Icon name="more" /></button>
          </div>
        })}
      </div>
    </article>
  )
}
