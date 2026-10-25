import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { dashboardCard, dashboardContacts, dashboardProfile } from '../data/dashboard'
import { Sidebar } from './DashboardPage'

type DashboardDetailType = 'card' | 'contact' | 'profile'

interface DashboardDetailsPageProps {
  type: DashboardDetailType
}

function toContactId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="detail-field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function DashboardDetailsPage({ type }: DashboardDetailsPageProps) {
  const { contactId } = useParams()
  const contact = type === 'contact'
    ? dashboardContacts.find(([name]) => toContactId(name) === contactId)
    : undefined
  const title = type === 'card' ? 'Card Details' : type === 'profile' ? 'Profile' : contact?.[0] ?? 'Contact Details'

  return (
    <div className="dashboard-shell section-page-shell">
      <Sidebar />
      <main className="main-area">
        <header className="page-heading">
          <h1>{title}</h1>
          <Link to="/dashboard" className="download-button detail-back">
            <ArrowLeft size={15} />
            <span>Back</span>
          </Link>
        </header>
        <div className="detail-layout">
          {type === 'card' && (
            <section className="panel detail-panel" aria-label="Card details">
              <div className="detail-card-preview">
                <div className="credit-card">
                  <div className="credit-card-top"><span className="chip"><i /></span><span className="visa">{dashboardCard.brand}</span></div>
                  <div className="card-number">{dashboardCard.number}</div>
                  <div className="credit-card-bottom">
                    <span><small>Card holder</small>{dashboardCard.holder}</span>
                    <span><small>Expires</small>{dashboardCard.expiry}</span>
                  </div>
                </div>
              </div>
              <dl className="detail-fields">
                <DetailField label="Card type">{dashboardCard.brand}</DetailField>
                <DetailField label="Card number">{dashboardCard.number}</DetailField>
                <DetailField label="Card holder">{dashboardCard.holder}</DetailField>
                <DetailField label="Expiry date">{dashboardCard.expiry}</DetailField>
              </dl>
            </section>
          )}
          {type === 'contact' && (
            contact ? (
              <section className="panel detail-panel" aria-label="Contact details">
                <dl className="detail-fields">
                  <DetailField label="Name">{contact[0]}</DetailField>
                  <DetailField label="Position">{contact[1]}</DetailField>
                </dl>
              </section>
            ) : (
              <section className="panel detail-panel">
                <p className="detail-not-found">This contact could not be found.</p>
              </section>
            )
          )}
          {type === 'profile' && (
            <section className="panel detail-panel" aria-label="Profile details">
              <dl className="detail-fields">
                <DetailField label="Name">{dashboardProfile.name}</DetailField>
                <DetailField label="Email">{dashboardProfile.email}</DetailField>
              </dl>
              <div className="detail-options">
                <h2>Account &amp; Settings</h2>
                <div>Account information</div>
                <div>Privacy and security</div>
                <div>Notification preferences</div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
