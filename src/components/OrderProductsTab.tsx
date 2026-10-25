import type { OrderItem } from '../types/order'
import ExportMenu, { type ExportColumn } from './ExportMenu'

interface OrderProductsTabProps {
  items: OrderItem[]
  onEscapeListener: (listener: ((event: KeyboardEvent) => boolean) | null) => void
}

const fallbackItems: OrderItem[] = [
  { name: 'MacBook Pro 15 Retina Touch Bar MV902', qty: 1, price: 2500 },
  { name: 'Apple Watch Series 5 Edition GPS + Cellular', qty: 2, price: 1500 },
  { name: 'Apple iPhone 11 Pro Max 256GB Space Gray', qty: 1, price: 1100 },
]

function formatPrice(price: number) {
  return `$${price.toLocaleString('de-DE', { maximumFractionDigits: 2 })}`
}

function OrderItemsTable({ items }: { items: OrderItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-left text-[12px]">
        <thead>
          <tr className="border-b border-[#EDEDED] text-[10px] font-medium uppercase tracking-[0.035em] text-[#8A8A8A]">
            <th scope="col" className="w-1/2 py-3 pr-4 font-medium">Product</th>
            <th scope="col" className="w-[15%] py-3 px-2 font-medium">Price</th>
            <th scope="col" className="w-[15%] py-3 px-2 text-center font-medium">Quantity</th>
            <th scope="col" className="w-[20%] py-3 pl-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.name}-${index}`} className="h-[42px] border-b border-[#EDEDED] text-[#222]">
              <td className="max-w-0 truncate pr-4" title={item.name}>{item.name}</td>
              <td className="whitespace-nowrap px-2">{formatPrice(item.price)}</td>
              <td className="px-2 text-center">{item.qty}</td>
              <td className="whitespace-nowrap pl-2 text-right">{formatPrice(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function OrderProductsTab({
  items,
  onEscapeListener,
}: OrderProductsTabProps) {
  const productItems = items.length > 0 ? items : fallbackItems
  const columns: ExportColumn[] = [
    { key: 'name', label: 'Product' },
    { key: 'price', label: 'Price' },
    { key: 'qty', label: 'Quantity' },
  ]

  return (
    <div
      role="tabpanel"
      id="order-panel-products"
      aria-labelledby="order-tab-products"
      className="px-5 pb-[60px] pt-5 sm:px-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3 pr-8">
        <h2 id="order-details-title" className="m-0 text-[20px] font-medium text-[#222]">
          Products
        </h2>
        <ExportMenu data={productItems} columns={columns} filename="order-products" onEscapeListener={onEscapeListener} />
      </div>
      <OrderItemsTable items={productItems} />
    </div>
  )
}
