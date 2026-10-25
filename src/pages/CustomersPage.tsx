import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import AddCustomerModal from '../components/AddCustomerModal'
import CustomersTable from '../components/CustomersTable'
import ExportMenu, { type ExportColumn } from '../components/ExportMenu'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Tabs from '../components/Tabs'
import type { Customer } from '../types/customer'

const avatarUrl = 'https://i.pravatar.cc/80?img=12'

const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Regina Cooper', email: 'cooper@example.com', avatarUrl, location: 'Sochi, Russia', phone: '+1 (070) 123–4567', date: '12.09.20', status: 'Active' },
  { id: 'c2', name: 'Judith Black', email: 'black@example.com', avatarUrl, location: 'France, Paris', phone: '+1 (070) 123–8459', date: '12.09.20', status: 'Active' },
  { id: 'c3', name: 'Ronald Robertson', email: 'robe@example.com', avatarUrl, location: 'Sydney, Australia', phone: '+1 (070) 123–9221', date: '12.09.20', status: 'Blocked' },
  { id: 'c4', name: 'Dustin Williamson', email: 'williams@example.com', avatarUrl, location: 'Germany, Berlin', phone: '+1 (070) 123–0507', date: '12.09.20', status: 'Active' },
  { id: 'c5', name: 'Calvin Flores', email: 'flores@example.com', avatarUrl, location: 'New York, USA', phone: '+1 (070) 123–3791', date: '12.09.20', status: 'Active' },
  { id: 'c6', name: 'Robert Edwards', email: 'edwards@example.com', avatarUrl, location: 'Shanghai, China', phone: '+1 (070) 123–1147', date: '12.09.20', status: 'Active' },
  { id: 'c7', name: 'Colleen Warren', email: 'warren@example.com', avatarUrl, location: 'Canada, Ottawa', phone: '+1 (070) 123–9127', date: '12.09.20', status: 'Active' },
  { id: 'c8', name: 'Nathan Fox', email: 'fox@example.com', avatarUrl, location: 'London, UK', phone: '+1 (070) 123–5073', date: '12.09.20', status: 'Active' },
]

const tabLabels = ['All', 'Active', 'Blocked']
const defaultCounts = { All: 983, Active: 968, Blocked: 15 }

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [counts, setCounts] = useState<Record<string, number>>(defaultCounts)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [exportData, setExportData] = useState<Customer[]>(mockCustomers)
  const [exportSelectedIds, setExportSelectedIds] = useState<Set<string>>(new Set())
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const exportColumns: ExportColumn[] = [
    { key: 'name', label: 'Customer name' },
    { key: 'email', label: 'Email' },
    { key: 'location', label: 'Location' },
    { key: 'phone', label: 'Phone' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ]
  const updateExportData = useCallback((data: Customer[], selectedIds: Set<string>) => {
    setExportData(data)
    setExportSelectedIds(selectedIds)
  }, [])
  const updateCounts = useCallback((nextCounts: Record<string, number>) => {
    setCounts((current) => {
      if (Object.keys(nextCounts).every((key) => current[key] === nextCounts[key])) return current
      return nextCounts
    })
  }, [])

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="m-0 text-[20px] font-medium leading-tight text-ink">Customers</h1>
            <div className="flex items-center gap-2">
              <ExportMenu data={exportData} columns={exportColumns} filename="customers" selectedIds={exportSelectedIds} getRowId={(customer) => customer.id} />
              <button
                type="button"
                aria-label="Add customer"
                onClick={() => setAddCustomerOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white hover:bg-[#187926]"
              >
                <Plus size={17} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <Tabs
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab)
              }}
              labels={tabLabels}
              counts={counts}
              showViewToggle={false}
            />
          </div>
          <CustomersTable
            customers={customers}
            activeTab={activeTab}
            onCountsChange={updateCounts}
            onExportDataChange={updateExportData}
          />
        </main>
      </div>
      <AddCustomerModal
        open={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        onAddCustomer={(customer) => {
          const today = new Date()
          const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getFullYear()).slice(-2)}`
          setCustomers((current) => [{
            id: `c${Date.now()}`,
            name: customer.name ?? 'New Customer',
            email: customer.email ?? 'customer@example.com',
            avatarUrl,
            location: customer.location ?? 'United States',
            phone: customer.phone ?? '',
            date: customer.date ?? formattedDate,
            status: customer.status ?? 'Active',
          }, ...current])
        }}
      />
    </div>
  )
}
