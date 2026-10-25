import type { OrderItem } from '../types/order'

export function formatPrice(price: number): string {
  const isNegative = price < 0
  const absVal = Math.abs(price)
  const formatted = absVal.toLocaleString('de-DE', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
  return isNegative ? `-$${formatted}` : `$${formatted}`
}

export interface OrderItemsTableProps {
  items: OrderItem[]
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-left text-[12px]">
        <thead>
          <tr className="border-b border-[#EDEDED] text-[10px] font-medium uppercase tracking-[0.035em] text-[#8A8A8A]">
            <th scope="col" className="w-1/2 py-3 pr-4 font-medium">
              Product
            </th>
            <th scope="col" className="w-[15%] py-3 px-2 font-medium">
              Price
            </th>
            <th scope="col" className="w-[15%] py-3 px-2 text-center font-medium">
              Quantity
            </th>
            <th scope="col" className="w-[20%] py-3 pl-2 text-right font-medium">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.name}-${index}`} className="h-[42px] border-b border-[#EDEDED] text-[#222]">
              <td className="max-w-0 truncate pr-4" title={item.name}>
                {item.name}
              </td>
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
