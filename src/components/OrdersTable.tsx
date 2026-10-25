<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, MoreVertical, Search, SlidersHorizontal } from 'lucide-react'
import type { Order } from '../types/order'
import DataTable, { type DataTableColumn } from './DataTable'
import Pagination from './Pagination'
import StatusBadge from './StatusBadge'

interface OrdersTableProps {
  orders: Order[]
  activeTab: string
  onCountsChange: (counts: Record<string, number>) => void
  onViewOrder: (order: Order, trigger: HTMLElement) => void
  onExportDataChange: (data: Order[], selectedIds: Set<string>) => void
}

type SortKey = 'orderNo' | 'customer' | 'date' | 'total' | 'payment' | 'status'

const baseCounts: Record<string, number> = {
  All: 983,
  Pending: 128,
  Processing: 19,
  Refunded: 8,
}

function parseOrderDate(value: string): number {
  const [day, month, shortYear] = value.split('.').map(Number)
  return new Date(2000 + shortYear, month - 1, day).getTime()
}

export default function OrdersTable({ orders, activeTab, onCountsChange, onViewOrder, onExportDataChange }: OrdersTableProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(['o2', 'o3', 'o4']),
  )
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [pageState, setPageState] = useState({ tab: activeTab, page: 1 })
  const [pageSize, setPageSize] = useState(10)
  const [menuOrderId, setMenuOrderId] = useState<string | null>(null)
  const page = pageState.tab === activeTab ? pageState.page : 1

  const matchingOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return orders.filter(
      (order) =>
        (!normalized ||
          order.customer.toLowerCase().includes(normalized) ||
          order.orderNo.toLowerCase().includes(normalized)),
    )
  }, [orders, query])
  const searchedOrders = useMemo(
    () => matchingOrders.filter((order) => activeTab === 'All' || order.status === activeTab),
    [activeTab, matchingOrders],
  )

  const sortedOrders = useMemo(() => {
    const sorted = [...searchedOrders]
    if (sortKey) {
      sorted.sort((first, second) => {
        const comparison =
          sortKey === 'total'
            ? first.total - second.total
            : sortKey === 'date'
              ? parseOrderDate(first.date) - parseOrderDate(second.date)
              : first[sortKey].localeCompare(second[sortKey], undefined, { numeric: true })
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }
    return sorted
  }, [searchedOrders, sortDirection, sortKey])
  const visibleOrders = sortedOrders.slice((page - 1) * pageSize, page * pageSize)

  const pageCount = Math.max(1, Math.ceil(searchedOrders.length / pageSize))
  const allSelected = visibleOrders.length > 0 && visibleOrders.every((order) => selected.has(order.id))
  const someSelected = visibleOrders.some((order) => selected.has(order.id))

  useEffect(() => {
    onExportDataChange(sortedOrders, new Set(selected))
  }, [onExportDataChange, selected, sortedOrders])

  const tabCounts = useMemo(() => {
    if (!query.trim()) return baseCounts
    return {
      All: matchingOrders.length,
      Pending: matchingOrders.filter((order) => order.status === 'Pending').length,
      Processing: matchingOrders.filter((order) => order.status === 'Processing').length,
      Refunded: matchingOrders.filter((order) => order.status === 'Refunded').length,
    }
  }, [matchingOrders, query])

  useEffect(() => onCountsChange(tabCounts), [onCountsChange, tabCounts])

  function setPage(nextPage: number) {
    setPageState({ tab: activeTab, page: nextPage })
  }

  function toggleAll() {
    const next = new Set(selected)
    if (allSelected) visibleOrders.forEach((order) => next.delete(order.id))
    else visibleOrders.forEach((order) => next.add(order.id))
    setSelected(next)
  }

  function toggleOrder(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function updateSort(key: SortKey) {
    if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')
    else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const tableColumns: DataTableColumn<Order>[] = [
    {
      key: 'orderNo',
      label: 'Order no.',
      render: (order) => (
        <button
          type="button"
          onClick={(event) => onViewOrder(order, event.currentTarget)}
          className="whitespace-nowrap text-left text-[#858585] hover:text-primary"
        >
          {order.orderNo}
        </button>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (order) => (
        <button
          type="button"
          onClick={(event) => onViewOrder(order, event.currentTarget)}
          className="whitespace-nowrap text-left text-[12px] text-[#292929] hover:text-primary"
        >
          {order.customer}
        </button>
      ),
    },
    { key: 'date', label: 'Date', render: (order) => <span className="whitespace-nowrap text-[#858585]">{order.date}</span> },
    {
      key: 'total',
      label: 'Total',
      render: (order) => (
        <span className="whitespace-nowrap text-[#333]">
          ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: 'payment', label: 'Payment', render: (order) => <span className="whitespace-nowrap text-[#444]">{order.payment}</span> },
    { key: 'status', label: 'Status', render: (order) => <StatusBadge status={order.status} /> },
    {
      key: 'actions',
      label: '',
      sortable: false,
      headerClassName: 'w-8',
      cellClassName: 'w-8 pr-1',
      render: (order) => (
        <div className="relative text-right">
          <button
            type="button"
            aria-label={`More actions for ${order.customer}`}
            aria-expanded={menuOrderId === order.id}
            onClick={() => setMenuOrderId((current) => current === order.id ? null : order.id)}
            className="text-[#9A9A9A]"
          >
            <MoreVertical size={15} />
          </button>
          {menuOrderId === order.id && (
            <div className="absolute right-5 top-1 z-20 w-28 rounded-lg border border-[#EDEDED] bg-white p-1 text-left shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
              <button
                type="button"
                onClick={(event) => {
                  const trigger = event.currentTarget.closest('td')?.querySelector<HTMLElement>('[aria-expanded="true"]')
                  setMenuOrderId(null)
                  onViewOrder(order, trigger ?? event.currentTarget)
                }}
                className="h-8 w-full rounded-md px-2 text-left text-[11px] text-[#444] hover:bg-[#F5F5F5]"
              >
                View
              </button>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <section className="rounded-lg border border-[#EDEDED] bg-white p-4">
      <div className="relative mb-3 flex items-center justify-between gap-3">
        <label className="flex h-8 w-full max-w-[310px] items-center gap-2 rounded-full border border-[#E9E9E9] px-3 text-[#929292]">
          <Search size={14} />
          <input
            aria-label="Search orders"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search order…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-ink outline-none placeholder:text-[#A0A0A0]"
          />
          <button
            type="button"
            aria-label="Order filters"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[#929292] hover:bg-[#F0F0F0]"
          >
            <SlidersHorizontal size={14} />
          </button>
        </label>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-2 rounded-md border border-[#E9E9E9] px-3 text-[11px] text-[#555]"
        >
          Actions
          <ChevronDown size={13} className="text-muted" />
        </button>
      </div>

      <DataTable
        rows={visibleOrders}
        columns={tableColumns}
        getRowId={(order) => order.id}
        getRowLabel={(order) => `Select order for ${order.customer}`}
        selected={selected}
        onToggleRow={toggleOrder}
        onToggleAll={toggleAll}
        allSelected={allSelected}
        someSelected={someSelected}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key) => updateSort(key as SortKey)}
        emptyMessage="No orders found"
      />

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2 text-[10px] text-[#858585]">
          <label className="relative">
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
              className="h-8 appearance-none rounded-md border border-[#E7E7E7] bg-white py-0 pl-3 pr-7 text-[10px] text-[#555] outline-none"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
          </label>
          <span>
            Showing {searchedOrders.length === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, searchedOrders.length)} of {searchedOrders.length}
          </span>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </footer>
    </section>
  )
}
=======
import Icon from './Icon'

const orders = [
  { id: '#ORD-3982', customer: 'Olivia Martin', date: 'Sep 16, 2024', amount: '$342.00', status: 'Completed', initials: 'OM', color: 'blue' },
  { id: '#ORD-3981', customer: 'Ethan Walker', date: 'Sep 16, 2024', amount: '$128.50', status: 'Processing', initials: 'EW', color: 'orange' },
  { id: '#ORD-3980', customer: 'Sophia Davis', date: 'Sep 15, 2024', amount: '$564.20', status: 'Completed', initials: 'SD', color: 'purple' },
  { id: '#ORD-3979', customer: 'James Wilson', date: 'Sep 15, 2024', amount: '$89.00', status: 'Refunded', initials: 'JW', color: 'green' },
]

function OrdersTable() {
  return (
    <section className="panel orders-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Commerce</p>
          <h3>Last orders</h3>
        </div>
        <button className="text-button" type="button">View all <span aria-hidden="true">-&gt;</span></button>
      </div>
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="muted-cell">{order.id}</td>
                <td><div className="customer-cell"><span className={`customer-avatar ${order.color}`}>{order.initials}</span>{order.customer}</div></td>
                <td className="muted-cell">{order.date}</td>
                <td className="amount-cell">{order.amount}</td>
                <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td><button className="icon-button small" type="button" aria-label={`More options for ${order.id}`}><Icon name="more" size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default OrdersTable
>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
