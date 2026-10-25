import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { Address, FulfilmentStatus, Order, OrderItem, PaymentStatus } from '../types/order'
import Accordion from './Accordion'
import ExportMenu, { type ExportColumn } from './ExportMenu'
import InfoSelect from './InfoSelect'
import ModalTabs, { type OrderModalTab } from './ModalTabs'
import OrderProductsTab from './OrderProductsTab'
import StatusPanel from './StatusPanel'

interface OrderDetailsModalProps {
  open: boolean
  order: Order | null
  trigger: HTMLElement | null
  onClose: () => void
  onUpdate: (id: string, changes: Partial<Order>) => void
}

const sampleAddress: Address = {
  firstName: 'Regina',
  lastName: 'Cooper',
  address: '993 E. Brewer St. Holtsville',
  state: 'New York',
  city: 'New York',
  country: 'United States',
  phone: '+1(070) 4567-8800',
  email: 'example@mail.com',
  postcode: '11742',
}

const sampleItems: OrderItem[] = [
  { name: 'MacBook Pro 15 Retina Touch Bar MV902', qty: 1, price: 2500 },
  { name: 'Apple Watch Series 5 Edition GPS + Cellular', qty: 2, price: 1500 },
  { name: 'Apple iPhone 11 Pro Max 256GB Space Gray', qty: 1, price: 1100 },
]

function asAddress(address?: Address): Address {
  return address ?? sampleAddress
}

function AddressDetails({ address }: { address: Address }) {
  const columns: { label: string; value: string }[][] = [
    [
      { label: 'First name', value: address.firstName },
      { label: 'Last name', value: address.lastName },
      { label: 'Address', value: address.address },
    ],
    [
      { label: 'State/Region', value: address.state },
      { label: 'City', value: address.city },
      { label: 'Country', value: address.country },
    ],
    [
      { label: 'Phone', value: address.phone },
      { label: 'Email', value: address.email },
      { label: 'Postcode', value: address.postcode },
    ],
  ]

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-3">
      {columns.map((column, index) => (
        <div key={index} className="space-y-2">
          {column.map(({ label, value }) => (
            <p key={label} className="m-0 flex min-w-0 gap-1">
              <span className="shrink-0 text-[#8A8A8A]">{label}:</span>
              <span className="min-w-0 truncate text-[#333]" title={value}>{value}</span>
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function OrderDetailsModal({
  open,
  order,
  trigger,
  onClose,
  onUpdate,
}: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<OrderModalTab>('Order Details')
  const [billingOpen, setBillingOpen] = useState(true)
  const [shippingOpen, setShippingOpen] = useState(false)
  const escapeHandlerRef = useRef<((event: KeyboardEvent) => boolean) | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const setEscapeListener = useCallback(
    (listener: ((event: KeyboardEvent) => boolean) | null) => {
      escapeHandlerRef.current = listener
    },
    [],
  )

  const closeModal = useCallback(() => {
    setActiveTab('Order Details')
    setBillingOpen(true)
    setShippingOpen(false)
    onClose()
  }, [onClose])

  const details = useMemo(() => {
    if (!order) return null
    const [firstName, ...lastNameParts] = order.customer.split(' ')
    const lastName = lastNameParts.join(' ') || 'Cooper'
    const generatedAddress: Address = {
      ...sampleAddress,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replaceAll(' ', '')}@example.com`,
    }
    const customer = order.customerDetails ?? {
      name: order.customer,
      email: generatedAddress.email,
      phone: sampleAddress.phone,
      location: sampleAddress.address,
    }
    return {
      customer,
      payment: order.paymentDetails ?? {
        method: order.payment,
        transactionId: `${order.id.toUpperCase()}-TXHQ`,
        amount: order.total,
      },
      shipping: order.shipping ?? {
        method: 'Carrier' as const,
        trackingCode: `FX-${order.id.slice(1).padStart(6, '0')}-6`,
        date: '12.09.2019',
      },
      fulfilmentStatus: order.fulfilmentStatus ?? (
        order.status === 'Pending' || order.status === 'Processing' ? order.status : 'Delivered'
      ),
      paymentStatus: order.paymentStatus ?? (order.status === 'Refunded' ? 'Refunded' : 'Paid'),
      billingAddress: order.billingAddress ?? generatedAddress,
      shippingAddress: order.shippingAddress ?? generatedAddress,
      items: order.items ?? sampleItems,
    }
  }, [order])

  useEffect(() => {
    if (!open) {
      trigger?.focus()
      return
    }
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (escapeHandlerRef.current?.(event)) return
        event.preventDefault()
        closeModal()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, closeModal, trigger])

  if (!order || !details) return null

  const orderId = order.id
  const orderExportColumns: ExportColumn[] = [
    { key: 'orderNo', label: 'Order no.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'total', label: 'Total' },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status' },
  ]
  const currentFulfilmentStatus = details.fulfilmentStatus
  const slug = activeTab.toLowerCase().replaceAll(' ', '-')
  const panelProps = {
    role: 'tabpanel' as const,
    id: `order-panel-${slug}`,
    'aria-labelledby': `order-tab-${slug}`,
    className: 'p-5 sm:p-6',
  }

  function updateFulfilmentStatus(status: FulfilmentStatus) {
    const nextOrderStatus: Order['status'] =
      status === 'Delivered' || status === 'Shipped' ? 'Shipped' : status
    onUpdate(orderId, { fulfilmentStatus: status, status: nextOrderStatus })
  }

  function updatePaymentStatus(status: PaymentStatus) {
    onUpdate(orderId, {
      paymentStatus: status,
      status: status === 'Refunded'
        ? 'Refunded'
        : currentFulfilmentStatus === 'Pending'
          ? 'Pending'
          : currentFulfilmentStatus === 'Processing'
            ? 'Processing'
            : 'Shipped',
    })
  }

  return (
    <div
      className={`fixed inset-0 z-[130] flex justify-center overflow-y-auto bg-black/40 px-3 pt-[70px] transition-opacity duration-150 sm:px-4 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        aria-hidden={!open}
        inert={!open}
        className={`relative mb-8 h-fit max-h-[90vh] w-[680px] max-w-full overflow-y-auto rounded-lg bg-white shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-transform duration-150 ease-out ${
          open ? 'scale-100' : 'scale-[0.98]'
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={closeModal}
          className="absolute right-4 top-4 z-10 grid h-6 w-6 place-items-center rounded-md bg-[#F3F3F3] text-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
        >
          <X size={12} />
        </button>
        <ModalTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'Order Details' && (
          <div {...panelProps}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pr-8">
              <h2 id="order-details-title" className="m-0 text-[20px] font-medium text-[#222]">
                Orders <span className="font-normal text-[#8A8A8A]">{order.orderNo}</span>
              </h2>
              <ExportMenu data={[order]} columns={orderExportColumns} filename={`order-${order.orderNo}`} onEscapeListener={setEscapeListener} />
            </div>

            <section>
              <h3 className="mb-3 mt-0 text-[15px] font-medium text-[#222]">Customer</h3>
              <div className="hidden grid-cols-4 border-b border-[#EDEDED] pb-2 text-[9px] font-medium uppercase tracking-[0.04em] text-[#999] md:grid">
                <span>Name</span><span>Email</span><span>Phone</span><span>Location</span>
              </div>
              <div className="grid grid-cols-1 gap-x-3 gap-y-3 border-b border-[#EDEDED] py-3 text-[11px] text-[#333] md:grid-cols-4 md:items-center">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-[#E6F6D9] text-[9px] font-medium text-primary">
                    {details.customer.avatarUrl
                      ? <img src={details.customer.avatarUrl} alt="" className="h-full w-full object-cover" />
                      : details.customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                  </span>
                  <span className="shrink-0 text-[9px] uppercase text-[#999] md:hidden">Name:</span>
                  <span className="truncate md:block" title={details.customer.name}>{details.customer.name}</span>
                </div>
                <div className="grid min-w-0 grid-cols-[70px_1fr] gap-2 sm:block">
                  <span className="text-[9px] uppercase text-[#999] md:hidden">Email</span>
                  <span className="truncate md:block" title={details.customer.email}>{details.customer.email}</span>
                </div>
                <div className="grid min-w-0 grid-cols-[70px_1fr] gap-2 sm:block">
                  <span className="text-[9px] uppercase text-[#999] md:hidden">Phone</span>
                  <span className="truncate md:block" title={details.customer.phone}>{details.customer.phone}</span>
                </div>
                <div className="grid min-w-0 grid-cols-[70px_1fr] gap-2 sm:block">
                  <span className="text-[9px] uppercase text-[#999] md:hidden">Location</span>
                  <span className="truncate md:block" title={details.customer.location}>{details.customer.location}</span>
                </div>
              </div>
            </section>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_215px] md:gap-5">
              <section className="min-w-0">
                <h3 className="mb-3 mt-0 text-[15px] font-medium text-[#222]">Payment method</h3>
                <InfoSelect
                  label="Payment method"
                  value={details.payment.method}
                  options={['Credit Card', 'PayPal', 'Payoneer']}
                  onChange={(method) => onUpdate(order.id, {
                    payment: method as Order['payment'],
                    paymentDetails: { ...details.payment, method: method as Order['payment'] },
                  })}
                  className="w-[125px]"
                />
                <div className="mt-2 space-y-1 text-[10px]">
                  <p className="m-0"><span className="text-[#8A8A8A]">Transaction ID: </span><span className="text-[#333]">{details.payment.transactionId}</span></p>
                  <p className="m-0"><span className="text-[#8A8A8A]">Amount: </span><span className="text-[#333]">${details.payment.amount.toLocaleString('en-US')}</span></p>
                </div>
              </section>

              <section className="min-w-0">
                <h3 className="mb-3 mt-0 text-[15px] font-medium text-[#222]">Shipping method</h3>
                <InfoSelect
                  label="Shipping method"
                  value={details.shipping.method}
                  options={['Carrier', 'Pickup', 'Express']}
                  onChange={(method) => onUpdate(order.id, {
                    shipping: { ...details.shipping, method: method as typeof details.shipping.method },
                  })}
                  className="w-[125px]"
                />
                <div className="mt-2 space-y-1 text-[10px]">
                  <p className="m-0"><span className="text-[#8A8A8A]">Tracking Code: </span><span className="text-[#333]">{details.shipping.trackingCode}</span></p>
                  <p className="m-0"><span className="text-[#8A8A8A]">Date: </span><span className="text-[#333]">{details.shipping.date}</span></p>
                </div>
              </section>

              <StatusPanel
                fulfilmentStatus={details.fulfilmentStatus}
                paymentStatus={details.paymentStatus}
                onFulfilmentChange={updateFulfilmentStatus}
                onPaymentChange={updatePaymentStatus}
              />
            </div>

            <div className="mt-4 space-y-2">
              <Accordion id={`billing-${order.id}`} title="Billing address" open={billingOpen} onToggle={() => setBillingOpen((current) => !current)}>
                <AddressDetails address={asAddress(details.billingAddress)} />
              </Accordion>
              <Accordion id={`shipping-${order.id}`} title="Shipping address" open={shippingOpen} onToggle={() => setShippingOpen((current) => !current)}>
                <AddressDetails address={asAddress(details.shippingAddress)} />
              </Accordion>
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <OrderProductsTab items={details.items} onEscapeListener={setEscapeListener} />
        )}

        {activeTab === 'Invoice' && (
          <div {...panelProps}>
            <h2 id="order-details-title" className="mb-4 mt-0 text-[18px] font-medium text-[#222]">Invoice {order.orderNo}</h2>
            <div className="ml-auto max-w-[280px] space-y-3 text-[12px]">
              <div className="flex justify-between text-[#777]"><span>Subtotal</span><span>${order.total.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#777]"><span>Shipping</span><span>$0.00</span></div>
              <div className="flex justify-between text-[#777]"><span>Tax</span><span>$0.00</span></div>
              <div className="flex justify-between border-t border-[#EDEDED] pt-3 font-medium text-[#222]"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
              <ExportMenu data={[order]} columns={orderExportColumns} filename={`invoice-${order.orderNo}`} onEscapeListener={setEscapeListener} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
