<<<<<<< HEAD
import { Link, NavLink } from 'react-router-dom'
import { dashboardCard, dashboardContacts, dashboardProfile } from '../data/dashboard'

type IconName =
  | 'overview' | 'wallet' | 'chart' | 'message' | 'file' | 'download'
  | 'chevron' | 'calendar' | 'up' | 'down' | 'plus' | 'settings'
  | 'more' | 'search' | 'bell' | 'card' | 'shopping' | 'home'
  | 'transport' | 'food' | 'health' | 'customers'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }
  const paths: Record<IconName, React.ReactNode> = {
    overview: <><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" /><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" /><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" /><rect x="14" y="14" width="6.5" height="6.5" rx="1.5" /></>,
    wallet: <><rect x="3" y="6" width="18" height="14" rx="2.5" /><path d="M3 9h18M16 14h2" /><path d="M6 6V4.5A1.5 1.5 0 0 1 7.5 3H19" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.5-.7L4 20l1.5-3.5A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    file: <><path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" /><path d="M14 4v4h4M8 13h8M8 17h8" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M5 18v3h14v-3" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    up: <><path d="m7 14 5-5 5 5" /><path d="M12 9v10" /></>,
    down: <><path d="m7 10 5 5 5-5" /><path d="M12 5v10" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.1-.1a1.7 1.7 0 0 0-1.8.3l-.1.1h-3.4l-.1-.1a1.7 1.7 0 0 0-2.4-.8l-.1.1-2.9-1.7.1-.1a1.7 1.7 0 0 0-.3-1.8l-.1-.1v-3.4l.1-.1a1.7 1.7 0 0 0 .8-2.4l-.1-.1 1.7-2.9.1.1a1.7 1.7 0 0 0 1.8-.3l.1-.1h3.4l.1.1a1.7 1.7 0 0 0 2.4.8l.1-.1 2.9 1.7-.1.1a1.7 1.7 0 0 0 .3 1.8l.1.1v3.4Z" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4.2 4.2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
    shopping: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    home: <><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" /></>,
    transport: <><path d="M5 17h14l-1-8H6l-1 8ZM7 9l1-4h8l1 4M7 17v2M17 17v2M7 13h.01M17 13h.01" /></>,
    food: <><path d="M4 11h16l-1 9H5l-1-9ZM3 11l2-5h14l2 5M9 6V4M15 6V4" /></>,
    health: <><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" /><path d="M8.5 12h7" /></>,
    customers: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Avatar({ name, image, color }: { name: string; image: number; color: string }) {
  return <img className="avatar" src={`https://i.pravatar.cc/120?img=${image}`} alt={name} style={{ '--avatar-color': color } as React.CSSProperties} />
}

const transactions = [
  ['Ronald Robertson', 'Payment', 'Today, 10:30 AM', '+$250.00', 12, '#e4b28e'],
  ['Regina Cooper', 'Payment', 'Today, 09:15 AM', '+$120.00', 47, '#d7a19b'],
  ['Judith Black', 'Refund', 'Yesterday, 04:45 PM', '-$45.00', 44, '#b8c9b4'],
  ['Dustin Williamson', 'Payment', 'Yesterday, 02:20 PM', '+$320.00', 13, '#d7bd9b'],
  ['Calvin Flores', 'Payment', '22 Aug, 11:10 AM', '+$180.00', 68, '#b6a2ce'],
  ['Robert Edwards', 'Payment', '21 Aug, 08:35 AM', '+$95.00', 22, '#8fb8bc'],
] as const

const payments = [
  ['Shopping', 'Today, 10:30 AM', '$350.00', 'shopping', 'shopping'],
  ['House rent', 'Today, 09:15 AM', '$1,200.00', 'home', 'home'],
  ['Transport', 'Yesterday, 04:45 PM', '$85.00', 'transport', 'transport'],
  ['Food & Drink', 'Yesterday, 02:20 PM', '$120.00', 'food', 'food'],
  ['Healthcare', '22 Aug, 11:10 AM', '$65.00', 'health', 'health'],
] as const

function ActionButton({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <button className={`icon-button ${className}`} type="button" aria-label={label}>{children}</button>
}

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-mark" role="img" aria-label="Brand logo"><span /><span /><span /><span /></div>
      <nav className="side-nav" aria-label="Dashboard sections">
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} aria-label="Dashboard" title="Dashboard"><Icon name="overview" /></NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} aria-label="Products" title="Products"><Icon name="shopping" /></NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} aria-label="Orders" title="Orders"><Icon name="card" /></NavLink>
        <NavLink to="/customers" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} aria-label="Customers" title="Customers"><Icon name="customers" /></NavLink>
      </nav>
    </aside>
  )
}

function StatCard({ type, title, value, percent }: { type: 'income' | 'spent'; title: string; value: string; percent: string }) {
  return (
    <article className={`stat-card ${type}`}>
      <div className="stat-head">
        <span className="stat-icon"><Icon name={type === 'income' ? 'up' : 'down'} size={17} /></span>
        <span className="stat-name">{title}</span>
        <ActionButton label={`More ${title.toLowerCase()} options`}><Icon name="more" /></ActionButton>
      </div>
      <strong className="stat-amount">{value}</strong>
      <div className="stat-foot"><span>{percent} <small>this week</small></span><span className="progress"><i /></span></div>
    </article>
  )
}

function BalanceChart() {
  const x = [76, 194, 312, 430, 548, 666, 784]
  const income = [132, 112, 123, 67, 96, 42, 70]
  const spending = [168, 145, 160, 125, 146, 102, 130]
  const toPath = (values: number[]) => values.map((y, index) => `${index ? 'L' : 'M'} ${x[index]} ${y}`).join(' ')
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const yLabels = ['3.000', '2.500', '2.000', '1.500', '1.000', '500', '0']
  const gridY = [12, 44, 76, 108, 140, 172, 204]
  return (
    <div className="balance-chart">
      <svg viewBox="0 0 820 235" preserveAspectRatio="none" role="img" aria-label="Income and spending from Monday to Sunday">
        <defs><linearGradient id="balance-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#45b783" stopOpacity=".16" /><stop offset="100%" stopColor="#45b783" stopOpacity="0" /></linearGradient></defs>
        {gridY.map((y, index) => <g key={y}><line className="chart-grid" x1="52" x2="808" y1={y} y2={y} /><text className="chart-label" x="0" y={y + 3}>{yLabels[index]}</text></g>)}
        <path d={`${toPath(income)} L 784 204 L 76 204 Z`} fill="url(#balance-area)" />
        <path className="income-line" d={toPath(income)} />
        <path className="spending-line" d={toPath(spending)} />
        <circle className="chart-focus" cx="430" cy="67" r="5" />
        {days.map((day, index) => <text className="chart-label" key={day} x={x[index]} y="229" textAnchor="middle">{day}</text>)}
      </svg>
      <div className="chart-tooltip"><strong>2.500</strong><strong>1.200</strong><span>22 August, 2019</span></div>
=======
import { useState } from 'react'
import DateSelector from '../components/DateSelector'
import Icon from '../components/Icon'
import ChartPanel from '../components/ChartPanel'
import OrdersTable from '../components/OrdersTable'
import StatCard from '../components/StatCard'
import TransactionsList from '../components/TransactionsList'
import { downloadCsv } from '../utils/downloadCsv'

const dashboardPeriodOptions = [
  { value: 'current', label: 'Sep 10 - Sep 16, 2024' },
  { value: 'aug-2024', label: 'Aug 11 - Aug 17, 2024' },
  { value: 'jul-2024', label: 'Jul 12 - Jul 18, 2024' },
  { value: 'jun-2024', label: 'Jun 13 - Jun 19, 2024' },
]

const dashboardDataByPeriod: Record<string, { rows: Array<{ Metric: string; Value: string; Change: string }>; stats: Array<{ label: string; value: string; change: string; direction: 'up' | 'down'; icon: 'wallet' | 'orders' | 'users' | 'credit-card'; tone: 'blue' | 'purple' | 'orange' | 'green' }> }> = {
  current: {
    rows: [
      { Metric: 'Total revenue', Value: '$84,248.60', Change: '12.8%' },
      { Metric: 'Total orders', Value: '2,456', Change: '8.2%' },
      { Metric: 'New customers', Value: '1,284', Change: '4.6%' },
      { Metric: 'Average order value', Value: '$128.40', Change: '2.4%' },
    ],
    stats: [
      { label: 'Total revenue', value: '$84,248.60', change: '12.8%', direction: 'up', icon: 'wallet', tone: 'blue' },
      { label: 'Total orders', value: '2,456', change: '8.2%', direction: 'up', icon: 'orders', tone: 'purple' },
      { label: 'New customers', value: '1,284', change: '4.6%', direction: 'up', icon: 'users', tone: 'orange' },
      { label: 'Average order value', value: '$128.40', change: '2.4%', direction: 'down', icon: 'credit-card', tone: 'green' },
    ],
  },
  'aug-2024': {
    rows: [
      { Metric: 'Total revenue', Value: '$76,140.40', Change: '10.5%' },
      { Metric: 'Total orders', Value: '2,312', Change: '6.4%' },
      { Metric: 'New customers', Value: '1,146', Change: '3.7%' },
      { Metric: 'Average order value', Value: '$121.90', Change: '1.7%' },
    ],
    stats: [
      { label: 'Total revenue', value: '$76,140.40', change: '10.5%', direction: 'up', icon: 'wallet', tone: 'blue' },
      { label: 'Total orders', value: '2,312', change: '6.4%', direction: 'up', icon: 'orders', tone: 'purple' },
      { label: 'New customers', value: '1,146', change: '3.7%', direction: 'up', icon: 'users', tone: 'orange' },
      { label: 'Average order value', value: '$121.90', change: '1.7%', direction: 'down', icon: 'credit-card', tone: 'green' },
    ],
  },
  'jul-2024': {
    rows: [
      { Metric: 'Total revenue', Value: '$71,830.20', Change: '8.9%' },
      { Metric: 'Total orders', Value: '2,168', Change: '5.1%' },
      { Metric: 'New customers', Value: '1,064', Change: '2.8%' },
      { Metric: 'Average order value', Value: '$118.20', Change: '1.8%' },
    ],
    stats: [
      { label: 'Total revenue', value: '$71,830.20', change: '8.9%', direction: 'up', icon: 'wallet', tone: 'blue' },
      { label: 'Total orders', value: '2,168', change: '5.1%', direction: 'up', icon: 'orders', tone: 'purple' },
      { label: 'New customers', value: '1,064', change: '2.8%', direction: 'up', icon: 'users', tone: 'orange' },
      { label: 'Average order value', value: '$118.20', change: '1.8%', direction: 'down', icon: 'credit-card', tone: 'green' },
    ],
  },
  'jun-2024': {
    rows: [
      { Metric: 'Total revenue', Value: '$68,920.40', Change: '7.7%' },
      { Metric: 'Total orders', Value: '2,034', Change: '4.2%' },
      { Metric: 'New customers', Value: '962', Change: '2.3%' },
      { Metric: 'Average order value', Value: '$114.70', Change: '1.1%' },
    ],
    stats: [
      { label: 'Total revenue', value: '$68,920.40', change: '7.7%', direction: 'up', icon: 'wallet', tone: 'blue' },
      { label: 'Total orders', value: '2,034', change: '4.2%', direction: 'up', icon: 'orders', tone: 'purple' },
      { label: 'New customers', value: '962', change: '2.3%', direction: 'up', icon: 'users', tone: 'orange' },
      { label: 'Average order value', value: '$114.70', change: '1.1%', direction: 'down', icon: 'credit-card', tone: 'green' },
    ],
  },
}

function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [activeModal, setActiveModal] = useState<'card' | 'contact' | null>(null)
  const selectedData = dashboardDataByPeriod[selectedPeriod] ?? dashboardDataByPeriod.current

  const handleExport = () => {
    downloadCsv('dashboard-report.csv', ['Metric', 'Value', 'Change'], selectedData.rows)
  }

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="dashboard-heading">
        <div><p className="section-kicker">Monday, September 16, 2024</p><h2 id="dashboard-title">Good morning, Alex</h2><p className="page-subtitle">Here&apos;s what&apos;s happening with your store today.</p></div>
        <div className="dashboard-actions"><DateSelector options={dashboardPeriodOptions} value={selectedPeriod} onChange={setSelectedPeriod} /><button className="download-button" type="button" onClick={handleExport}><Icon name="download" size={16} /> Export</button></div>
      </div>
      <div className="stats-grid">
        {selectedData.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} direction={stat.direction} icon={stat.icon} tone={stat.tone} />
        ))}
      </div>
      <div className="analytics-grid"><ChartPanel type="revenue" /><ChartPanel type="channels" /></div>
      <div className="performance-grid"><section className="panel performance-panel"><div className="panel-heading"><div><p className="section-kicker">Performance</p><h3>Sales overview</h3></div><button className="icon-button" type="button" aria-label="More options"><Icon name="more" /></button></div><div className="sales-bars"><div className="bar-group"><span className="bar-value">$12.4k</span><div className="bar blue-bar" style={{ height: '88%' }} /><span>Mon</span></div><div className="bar-group"><span className="bar-value">$9.8k</span><div className="bar blue-bar" style={{ height: '68%' }} /><span>Tue</span></div><div className="bar-group"><span className="bar-value">$15.2k</span><div className="bar blue-bar" style={{ height: '100%' }} /><span>Wed</span></div><div className="bar-group"><span className="bar-value">$11.6k</span><div className="bar blue-bar" style={{ height: '80%' }} /><span>Thu</span></div><div className="bar-group"><span className="bar-value">$13.8k</span><div className="bar blue-bar" style={{ height: '91%' }} /><span>Fri</span></div><div className="bar-group"><span className="bar-value">$8.6k</span><div className="bar blue-bar" style={{ height: '58%' }} /><span>Sat</span></div><div className="bar-group"><span className="bar-value">$12.8k</span><div className="bar blue-bar" style={{ height: '84%' }} /><span>Sun</span></div></div></section><TransactionsList /></div>
      <OrdersTable />
      <div className="dashboard-resource-grid">
        <section className="panel dashboard-resource-panel">
          <div className="panel-heading"><div><p className="section-kicker">Wallet</p><h3>Cards</h3></div><button className="add-icon-button" type="button" aria-label="Add card" onClick={() => setActiveModal('card')}><Icon name="plus" size={17} /></button></div>
          <div className="dashboard-card-preview"><div><span className="card-chip" /><strong>•••• 9843</strong></div><span>VISA</span></div>
          <div className="resource-meta"><span>Regina Cooper</span><strong>$8,420.00</strong></div>
        </section>
        <section className="panel dashboard-resource-panel">
          <div className="panel-heading"><div><p className="section-kicker">People</p><h3>Contacts</h3></div><button className="add-icon-button" type="button" aria-label="Add contact" onClick={() => setActiveModal('contact')}><Icon name="plus" size={17} /></button></div>
          <div className="contact-preview"><span className="contact-avatar">RC</span><div><strong>Regina Cooper</strong><span>Project Manager</span></div><span className="contact-status">Active</span></div>
          <div className="contact-preview"><span className="contact-avatar contact-avatar-blue">OM</span><div><strong>Olivia Martin</strong><span>Account Executive</span></div><span className="contact-status">Active</span></div>
        </section>
      </div>
      {activeModal && <DashboardModal type={activeModal} onClose={() => setActiveModal(null)} />}
    </section>
  )
}

function DashboardModal({ type, onClose }: { type: 'card' | 'contact'; onClose: () => void }) {
  const isCard = type === 'card'
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`dashboard-modal ${isCard ? 'card-modal' : 'contact-modal'}`} role="dialog" aria-modal="true" aria-labelledby={`${type}-modal-title`} onClick={(event) => event.stopPropagation()}>
        <div className="dashboard-modal-header"><div><p className="section-kicker">{isCard ? 'Wallet' : 'People'}</p><h3 id={`${type}-modal-title`}>{isCard ? 'Add Card' : 'Add Contact'}</h3></div><button className="modal-close-button" type="button" aria-label={`Close ${type} modal`} onClick={onClose}><Icon name="close" size={18} /></button></div>
        {!isCard && <div className="modal-profile-avatar">RC</div>}
        <form className="dashboard-form" onSubmit={(event) => { event.preventDefault(); onClose() }}>
          {isCard ? <>
            <label className="form-field"><span>Card Number</span><input required placeholder="5890 - 6858 - 6332 - 9843" /></label>
            <label className="form-field"><span>Card Holder</span><input required placeholder="Regina Cooper" /></label>
            <div className="form-field-row"><label className="form-field"><span>Month</span><input required placeholder="12" /></label><label className="form-field"><span>Year</span><input required placeholder="2023" /></label></div>
          </> : <>
            <div className="form-field-row"><label className="form-field"><span>First Name</span><input required placeholder="Regina" /></label><label className="form-field"><span>Last Name</span><input required placeholder="Cooper" /></label></div>
            <label className="form-field"><span>Email</span><input required type="email" placeholder="regina_cooper@mail.com" /></label>
            <label className="form-field"><span>Phone</span><span className="phone-field"><select aria-label="Country code" defaultValue="+1"><option>+1</option><option>+44</option><option>+91</option></select><input required type="tel" placeholder="(070) 4567-8800" /></span></label>
            <label className="form-field"><span>Job Title</span><input required placeholder="Project Manager" /></label>
          </>}
          <button className="modal-submit" type="submit">{isCard ? 'Add Card' : 'Add Contact'}</button>
        </form>
      </div>
>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
    </div>
  )
}

<<<<<<< HEAD
function BalanceCard() {
  return (
    <article className="panel balance-card">
      <div className="panel-heading"><h2>Balance</h2><button className="date-button" type="button"><Icon name="calendar" size={15} />19 Aug – 25 Aug<Icon name="chevron" size={14} /></button></div>
      <div className="balance-summary">
        <div><strong>$5.750</strong><span><i className="summary-arrow income-arrow"><Icon name="up" size={13} /></i>Income</span></div>
        <div><strong>$2.400</strong><span><i className="summary-arrow spending-arrow"><Icon name="down" size={13} /></i>Spending</span></div>
      </div>
      <BalanceChart />
    </article>
  )
}

function TransactionsCard() {
  return (
    <article className="panel list-card">
      <div className="panel-heading"><h2>Transactions</h2><ActionButton label="More transactions options"><Icon name="more" /></ActionButton></div>
      <div className="transaction-list">
        {transactions.map(([name, label, date, amount, image, color]) => (
          <div className="transaction-row" key={`${name}-${date}`}>
            <Avatar name={name} image={image} color={color} />
            <div className="row-copy"><strong>{name}</strong><span>{date}</span></div>
            <span className={`transaction-label ${label.toLowerCase()}`}>{label}</span>
            <strong className={`row-amount ${amount.startsWith('-') ? 'negative' : 'positive'}`}>{amount}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function PaymentsCard() {
  return (
    <article className="panel list-card payments-card">
      <div className="panel-heading"><h2>Payments</h2><ActionButton label="More payment options"><Icon name="more" /></ActionButton></div>
      <div className="payment-list">
        {payments.map(([name, date, amount, icon, color]) => (
          <div className="payment-row" key={name}>
            <span className={`payment-icon ${color}`}><Icon name={icon} size={17} /></span>
            <div className="row-copy"><strong>{name}</strong><span>{date}</span></div>
            <strong className="row-amount">{amount}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function CreditCard() {
  return (
    <Link to="/dashboard/cards" aria-label="Open card details" className="credit-card card-link">
      <div className="credit-card-top"><span className="chip"><i /></span><span className="visa">VISA</span></div>
      <div className="card-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 4582</div>
      <div className="credit-card-bottom"><span><small>Card holder</small>{dashboardCard.holder}</span><span><small>Expires</small>{dashboardCard.expiry}</span></div>
    </Link>
  )
}

function RightPanel() {
  return (
    <aside className="right-panel">
      <div className="profile-row">
        <Link to="/dashboard/profile" className="profile-copy profile-link" aria-label="Open profile details">
          <strong>{dashboardProfile.name}</strong><span>{dashboardProfile.email}</span>
        </Link>
        <ActionButton label="Settings"><Icon name="settings" size={19} /></ActionButton>
      </div>
      <section className="right-section cards-section">
        <div className="section-heading"><h2>Cards</h2><ActionButton label="Add card"><Icon name="plus" size={17} /></ActionButton></div>
        <CreditCard />
        <div className="carousel-dots" aria-label="Card 1 of 3"><i className="selected" /><i /><i /></div>
      </section>
      <section className="right-section contacts-section">
        <div className="section-heading"><h2>Contacts</h2><ActionButton label="Add contact"><Icon name="plus" size={17} /></ActionButton></div>
        <div className="contact-list">
          {dashboardContacts.map(([name, role]) => (
            <div className="contact-row" key={name}>
              <Link to={`/dashboard/contacts/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="contact-main">
                <div className="row-copy"><strong>{name}</strong><span>{role}</span></div>
              </Link>
              <ActionButton label={`More options for ${name}`} className="contact-more"><Icon name="more" /></ActionButton>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-area">
        <header className="page-heading">
          <h1>Overview</h1>
          <div className="heading-actions">
            <button className="download-button" type="button"><Icon name="download" size={16} /><span>Download</span></button>
            <button className="date-button" type="button">Last 7 days<Icon name="chevron" size={14} /></button>
          </div>
        </header>
        <div className="dashboard-content">
          <section className="overview-grid" aria-label="Account overview">
            <div className="stats-stack">
              <StatCard type="income" title="Income" value="$5.750" percent="+12.8%" />
              <StatCard type="spent" title="Spent" value="$2.400" percent="-4.3%" />
            </div>
            <BalanceCard />
          </section>
          <section className="lower-grid" aria-label="Recent activity">
            <TransactionsCard />
            <PaymentsCard />
          </section>
        </div>
      </main>
      <RightPanel />
    </div>
  )
}
=======
export default DashboardPage
>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
