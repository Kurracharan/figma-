import { formatPrice } from './OrderItemsTable'

export const TAX_RATE = 0.2
export const DISCOUNT_RATE = 0.1

export interface InvoiceTotalsProps {
  subtotal: number
}

export default function InvoiceTotals({ subtotal }: InvoiceTotalsProps) {
  const afterTaxAmount = subtotal * (1 + TAX_RATE)
  const discountAmount = afterTaxAmount * DISCOUNT_RATE
  const total = afterTaxAmount - discountAmount

  return (
    <div className="ml-auto w-full sm:w-[220px]">
      <dl className="m-0 space-y-0">
        <div className="flex h-[34px] items-center justify-between gap-4">
          <dt className="text-[10px] font-normal uppercase text-[#8A8A8A] sm:text-[11px]">
            SUBTOTAL
          </dt>
          <dd className="m-0 text-[12px] text-[#8A8A8A]">
            {formatPrice(subtotal)}
          </dd>
        </div>

        <div className="flex h-[34px] items-center justify-between gap-4">
          <dt className="text-[10px] font-normal uppercase text-[#8A8A8A] sm:text-[11px]">
            {`TAX(${TAX_RATE * 100}%)`}
          </dt>
          <dd className="m-0 text-[12px] text-[#8A8A8A]">
            {formatPrice(afterTaxAmount)}
          </dd>
        </div>

        <div className="flex h-[34px] items-center justify-between gap-4">
          <dt className="text-[10px] font-normal uppercase text-[#8A8A8A] sm:text-[11px]">
            DISCOUNT
          </dt>
          <dd className="m-0 text-[12px] text-[#8A8A8A]">
            {formatPrice(-discountAmount)}
          </dd>
        </div>

        <div className="flex h-[34px] items-center justify-between gap-4">
          <dt className="text-[11px] font-normal uppercase text-[#222]">
            TOTAL
          </dt>
          <dd className="m-0 text-[13px] font-medium text-[#222]">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
