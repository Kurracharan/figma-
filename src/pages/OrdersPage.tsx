import { useCallback, useRef, useState } from 'react'
import ExportMenu, { type ExportColumn } from '../components/ExportMenu'
import Header from '../components/Header'
import OrderDetailsModal from '../components/OrderDetailsModal'
import OrdersTable from '../components/OrdersTable'
import Sidebar from '../components/Sidebar'
import Tabs from '../components/Tabs'
import type { Order } from '../types/order'

const mockOrders: Order[] = [
  { id: 'o1', orderNo: '#790841', customer: 'Claire Warren', date: '12.09.20', total: 145.85, payment: 'PayPal', status: 'Shipped' },
  { id: 'o2', orderNo: '#790841', customer: 'Theresa Robertson', date: '12.09.20', total: 225.15, payment: 'Credit Card', status: 'Shipped' },
  { id: 'o3', orderNo: '#790841', customer: 'Nathan Hawkins', date: '12.09.20', total: 45.55, payment: 'PayPal', status: 'Shipped' },
  { id: 'o4', orderNo: '#790841', customer: 'Lily Williamson', date: '12.09.20', total: 305.25, payment: 'Credit Card', status: 'Processing' },
  { id: 'o5', orderNo: '#790841', customer: 'Brooklyn Steward', date: '12.09.20', total: 483.80, payment: 'Credit Card', status: 'Shipped' },
  { id: 'o6', orderNo: '#790841', customer: 'Norma Flores', date: '12.09.20', total: 128.79, payment: 'Payoneer', status: 'Processing' },
  { id: 'o7', orderNo: '#790841', customer: 'Leslie Mckinney', date: '12.09.20', total: 105.05, payment: 'Credit Card', status: 'Cancelled' },
  { id: 'o8', orderNo: '#790841', customer: 'Gregory Black', date: '12.09.20', total: 1028.15, payment: 'PayPal', status: 'Shipped' },
  {
    id: 'o12',
    orderNo: '#790841',
    customer: 'Regina Cooper',
    date: '12.09.20',
    total: 2500,
    payment: 'Credit Card',
    status: 'Shipped',
    customerDetails: {
      name: 'Regina Cooper',
      email: 'example@mail.com',
      phone: '+1(070) 4567-8800',
      location: '993 E. Brewer St. Holtsville',
    },
    paymentDetails: { method: 'Credit Card', transactionId: '000001-TXHQ', amount: 2500 },
    shipping: { method: 'Carrier', trackingCode: 'FX-012345-6', date: '12.09.2019' },
    fulfilmentStatus: 'Delivered',
    paymentStatus: 'Paid',
    billingAddress: {
      firstName: 'Regina',
      lastName: 'Cooper',
      address: '993 E. Brewer St. Holtsville',
      state: 'New York',
      city: 'New York',
      country: 'United States',
      phone: '+1(070) 4567-8800',
      email: 'example@mail.com',
      postcode: '11742',
    },
    items: [{ name: 'Apple iPhone 11 Pro Max 256GB Space Gray', qty: 1, price: 2500 }],
  },
  { id: 'o9', orderNo: '#790842', customer: 'Oliver Cooper', date: '13.09.20', total: 215.40, payment: 'Payoneer', status: 'Pending' },
  { id: 'o10', orderNo: '#790843', customer: 'Mia Mitchell', date: '13.09.20', total: 362.10, payment: 'Credit Card', status: 'Pending' },
  { id: 'o11', orderNo: '#790844', customer: 'Evelyn Reed', date: '14.09.20', total: 88.50, payment: 'PayPal', status: 'Refunded' },
]

const tabLabels = ['All', 'Pending', 'Processing', 'Refunded']
const defaultCounts = { All: 983, Pending: 128, Processing: 19, Refunded: 8 }

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [counts, setCounts] = useState<Record<string, number>>(defaultCounts)
  const [orders, setOrders] = useState(mockOrders)
  const [exportData, setExportData] = useState<Order[]>(mockOrders)
  const [exportSelectedIds, setExportSelectedIds] = useState<Set<string>>(new Set(['o2', 'o3', 'o4']))
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const closeTimer = useRef<number | null>(null)
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null
  const exportColumns: ExportColumn[] = [
    { key: 'orderNo', label: 'Order no.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'total', label: 'Total' },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status' },
  ]
  const updateExportData = useCallback((data: Order[], selectedIds: Set<string>) => {
    setExportData(data)
    setExportSelectedIds(selectedIds)
  }, [])
  const updateCounts = useCallback((nextCounts: Record<string, number>) => {
    setCounts((current) => {
      if (Object.keys(nextCounts).every((key) => current[key] === nextCounts[key])) return current
      return nextCounts
    })
  }, [])

  const openOrder = useCallback((order: Order, element: HTMLElement) => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    setTrigger(element)
    setSelectedOrderId(order.id)
    setModalOpen(true)
  }, [])

  const closeOrder = useCallback(() => {
    setModalOpen(false)
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setSelectedOrderId(null), 160)
  }, [])

  const updateOrder = useCallback((id: string, changes: Partial<Order>) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, ...changes } : order))
  }, [])

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="m-0 text-[20px] font-medium leading-tight text-ink">Orders</h1>
            <ExportMenu data={exportData} columns={exportColumns} filename="orders" selectedIds={exportSelectedIds} getRowId={(order) => order.id} />
          </div>
          <div className="mb-0">
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              labels={tabLabels}
              counts={counts}
              showViewToggle={false}
              variant="folder"
            />
          </div>
          <OrdersTable
            orders={orders}
            activeTab={activeTab}
            onCountsChange={updateCounts}
            onViewOrder={openOrder}
            onExportDataChange={updateExportData}
          />
        </main>
      </div>
      <OrderDetailsModal
        open={modalOpen}
        order={selectedOrder}
        trigger={trigger}
        onClose={closeOrder}
        onUpdate={updateOrder}
      />
    </div>
  )
}
