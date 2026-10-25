import Icon from './Icon'

type StatTone = 'blue' | 'green' | 'orange' | 'purple'

interface StatCardProps {
  label: string
  value: string
  change: string
  direction: 'up' | 'down'
  icon: 'wallet' | 'orders' | 'users' | 'credit-card' | 'chart'
  tone: StatTone
}

function StatCard({ label, value, change, direction, icon, tone }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}>
        <Icon name={icon} size={20} />
      </div>
      <p className="stat-label">{label}</p>
      <strong className="stat-value">{value}</strong>
      <p className={`stat-change ${direction}`}>
        <Icon name={direction === 'up' ? 'arrow-up' : 'arrow-down'} size={14} />
        {change} <span>vs last month</span>
      </p>
    </article>
  )
}

export default StatCard
