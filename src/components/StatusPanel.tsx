import type { FulfilmentStatus, PaymentStatus } from '../types/order'
import InfoSelect from './InfoSelect'

interface StatusPanelProps {
  fulfilmentStatus: FulfilmentStatus
  paymentStatus: PaymentStatus
  onFulfilmentChange: (status: FulfilmentStatus) => void
  onPaymentChange: (status: PaymentStatus) => void
}

export default function StatusPanel({
  fulfilmentStatus,
  paymentStatus,
  onFulfilmentChange,
  onPaymentChange,
}: StatusPanelProps) {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-3 rounded-[10px] bg-[#F5F5F5] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium text-[#333]">Fulfilment status</span>
        <InfoSelect
          label="Fulfilment status"
          value={fulfilmentStatus}
          options={['Pending', 'Processing', 'Shipped', 'Delivered']}
          onChange={(value) => onFulfilmentChange(value as FulfilmentStatus)}
          className="w-[105px] shrink-0"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium text-[#333]">Payment status</span>
        <InfoSelect
          label="Payment status"
          value={paymentStatus}
          options={['Unpaid', 'Paid', 'Refunded']}
          onChange={(value) => onPaymentChange(value as PaymentStatus)}
          className="w-[105px] shrink-0"
        />
      </div>
    </div>
  )
}
