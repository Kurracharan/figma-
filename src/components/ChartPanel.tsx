import Icon from './Icon'

const revenuePoints = '0,137 35,126 70,132 105,106 140,118 175,91 210,101 245,70 280,83 315,60 350,69 385,39 420,48 455,24 490,34 525,12'

function RevenueChart() {
  return (
    <div className="revenue-chart" aria-label="Revenue trend chart">
      <div className="chart-axis">
        <span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span>
      </div>
      <svg className="line-chart" role="img" viewBox="0 0 525 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4778f5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4778f5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 65, 105, 145].map((y) => <line key={y} x1="0" x2="525" y1={y} y2={y} />)}
        <polygon fill="url(#revenue-fill)" points={`0,160 ${revenuePoints} 525,160`} />
        <polyline points={revenuePoints} />
        <circle cx="525" cy="12" r="4" />
      </svg>
      <div className="chart-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div>
    </div>
  )
}

function SalesChannels() {
  return (
    <div className="channels-chart">
      <div className="donut" aria-label="Sales channels distribution chart"><span>Sales<br /><strong>100%</strong></span></div>
      <div className="channel-list">
        <div><span className="legend-dot blue" />Online store <strong>46%</strong></div>
        <div><span className="legend-dot purple" />Mobile app <strong>32%</strong></div>
        <div><span className="legend-dot orange" />Retail store <strong>22%</strong></div>
      </div>
    </div>
  )
}

interface ChartPanelProps {
  type: 'revenue' | 'channels'
}

function ChartPanel({ type }: ChartPanelProps) {
  const isRevenue = type === 'revenue'

  return (
    <section className={`panel chart-panel ${isRevenue ? 'revenue-panel' : 'channels-panel'}`}>
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Analytics</p>
          <h3>{isRevenue ? 'Revenue overview' : 'Sales by channel'}</h3>
        </div>
        <button className="icon-button" type="button" aria-label="More options"><Icon name="more" /></button>
      </div>
      {isRevenue ? (
        <>
          <div className="chart-summary"><strong>$84,248.60</strong><span className="positive">+12.8%</span></div>
          <RevenueChart />
        </>
      ) : <SalesChannels />}
    </section>
  )
}

export default ChartPanel
