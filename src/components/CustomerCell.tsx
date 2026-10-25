import { useState } from 'react'
import type { Customer } from '../types/customer'

export default function CustomerCell({ customer }: { customer: Customer }) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = customer.name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="flex min-w-[210px] items-center gap-2">
      {imageFailed ? (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#E6F6D9] text-[9px] font-medium text-primary">
          {initials}
        </span>
      ) : (
        <img
          src={customer.avatarUrl}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="flex min-w-0 flex-col gap-0.5 leading-tight">
        <span className="truncate text-[12px] font-normal text-[#222]">{customer.name}</span>
        <span className="truncate text-[11px] text-[#8A8A8A]">{customer.email}</span>
      </span>
    </div>
  )
}
