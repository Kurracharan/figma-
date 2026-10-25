import type { Order, OrderItem } from '../types/order'
import type { ExportColumn } from './ExportMenu'
import InvoiceHeader from './InvoiceHeader'
import InvoiceTotals from './InvoiceTotals'
import Logo from './Logo'
import OrderItemsTable from './OrderItemsTable'

export const InvoiceInfo = {
  company: {
    name: 'ROCKET INC.',
    address: 'Russell st. 50, Boston, MA, USA, 02199',
    phone: '+1 (070) 123–4567',
    email: 'info@rocket.com',
    website: 'www.rocketboard.com',
  },
  date: 'September 12, 2019',
}

const fallbackItems: OrderItem[] = [
  { name: 'MacBook Pro 15 Retina Touch Bar MV902', qty: 1, price: 2500 },
  { name: 'Apple Watch Series 5 Edition GPS + Cellular', qty: 2, price: 1500 },
  { name: 'Apple iPhone 11 Pro Max 256GB Space Gray', qty: 1, price: 1100 },
]

export interface OrderInvoiceTabProps {
  order: Order
  onEscapeListener: (listener: ((event: KeyboardEvent) => boolean) | null) => void
}

export default function OrderInvoiceTab({ order, onEscapeListener }: OrderInvoiceTabProps) {
  const items = order.items && order.items.length > 0 ? order.items : fallbackItems
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const displayOrderNo = order.orderNo.startsWith('#') ? order.orderNo : `#${order.orderNo}`

  const columns: ExportColumn[] = [
    { key: 'name', label: 'Product' },
    { key: 'price', label: 'Price' },
    { key: 'qty', label: 'Quantity' },
  ]

  return (
    <div
      role="tabpanel"
      id="order-panel-invoice"
      aria-labelledby="order-tab-invoice"
      className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6"
    >
      <div id="printable-invoice">
        <InvoiceHeader data={items} columns={columns} filename={`invoice-${order.orderNo}`} onEscapeListener={onEscapeListener} />

        {/* Invoice meta block */}
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left side: Badge & Company Details */}
          <div className="flex items-start gap-5">
            <div className="flex h-[105px] w-[100px] shrink-0 flex-col items-center justify-center rounded-none bg-invoice text-center">
              <span className="text-[13px] font-semibold uppercase tracking-[0.02em] text-white">
                INVOICE
              </span>
              <span className="mt-0.5 text-[12px] font-normal text-white">
                {displayOrderNo}
              </span>
            </div>

            <div className="text-[11px] leading-[1.6]">
              <p className="m-0 font-medium text-[#222]">{InvoiceInfo.company.name}</p>
              <p className="m-0 text-[#8A8A8A]">{InvoiceInfo.company.address}</p>
              <p className="m-0 text-[#8A8A8A]">{InvoiceInfo.company.phone}</p>
              <p className="m-0 text-[#8A8A8A]">{InvoiceInfo.company.email}</p>
              <p className="m-0 text-[#8A8A8A]">{InvoiceInfo.company.website}</p>
            </div>
          </div>

          {/* Right side: Date & Flower Logo */}
          <div className="flex flex-col md:items-end">
            <p className="m-0 text-[11px] text-[#8A8A8A] md:text-right">
              {InvoiceInfo.date}
            </p>
            <div className="mt-4 flex md:justify-end">
              <Logo iconSize={20} textSize="text-[13px]" />
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="mt-10">
          <OrderItemsTable items={items} />
        </div>

        {/* Totals block */}
        <div className="mt-5">
          <InvoiceTotals subtotal={subtotal} />
        </div>
      </div>
    </div>
  )
}
