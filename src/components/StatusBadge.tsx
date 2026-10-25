import type { ProductStatus } from '../types/product'

export type BadgeStatus = ProductStatus | 'Shipped' | 'Processing' | 'Cancelled' | 'Pending' | 'Refunded' | 'Active' | 'Blocked'

export default function StatusBadge({ status }: { status: BadgeStatus }) {
  const styles: Record<BadgeStatus, string> = {
    Available: 'bg-[#E8F6E2] text-[#318D36]',
    Shipped: 'bg-[#E8F6E2] text-[#318D36]',
    Processing: 'bg-[#FFF1E3] text-[#D88A32]',
    Disabled: 'bg-[#FFF1E3] text-[#D88A32]',
    Cancelled: 'bg-[#FDECEC] text-status-red',
    Pending: 'bg-[#FFF1E3] text-[#D88A32]',
    Refunded: 'bg-[#FDECEC] text-status-red',
    Active: 'bg-[#E8F6E2] text-[#318D36]',
    Blocked: 'bg-[#FFF1E3] text-[#D88A32]',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium leading-none ${styles[status]}`}
    >
      {status}
    </span>
  )
}
