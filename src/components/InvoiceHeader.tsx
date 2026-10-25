import ExportMenu, { type ExportColumn } from './ExportMenu'
import type { OrderItem } from '../types/order'

export interface InvoiceHeaderProps {
  data: OrderItem[]
  columns: ExportColumn[]
  filename: string
  onEscapeListener: (listener: ((event: KeyboardEvent) => boolean) | null) => void
}

export default function InvoiceHeader({ data, columns, filename, onEscapeListener }: InvoiceHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 pr-8">
      <h2 id="order-details-title" className="m-0 text-[20px] font-medium text-[#222]">
        Invoice
      </h2>
      <ExportMenu data={data} columns={columns} filename={filename} onEscapeListener={onEscapeListener} />
    </div>
  )
}
