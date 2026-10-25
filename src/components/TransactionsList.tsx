import Icon from './Icon'

const transactions = [
  { title: 'Payment received', detail: 'Olivia Martin · #ORD-3982', amount: '+$342.00', icon: 'wallet' as const, tone: 'green' },
  { title: 'New order placed', detail: 'Ethan Walker · #ORD-3981', amount: '+$128.50', icon: 'orders' as const, tone: 'blue' },
  { title: 'Refund processed', detail: 'James Wilson · #ORD-3979', amount: '-$89.00', icon: 'credit-card' as const, tone: 'orange' },
]

function TransactionsList() {
  return (
    <section className="panel transactions-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Activity</p>
          <h3>Transactions</h3>
        </div>
        <button className="icon-button" type="button" aria-label="More options"><Icon name="more" /></button>
      </div>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div className="transaction" key={transaction.title}>
            <span className={`transaction-icon ${transaction.tone}`}><Icon name={transaction.icon} size={18} /></span>
            <div className="transaction-copy"><strong>{transaction.title}</strong><span>{transaction.detail}</span></div>
            <strong className={transaction.amount.startsWith('-') ? 'negative' : 'positive'}>{transaction.amount}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TransactionsList
