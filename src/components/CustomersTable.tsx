import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, MoreVertical, Search, SlidersHorizontal } from 'lucide-react'
import type { Customer } from '../types/customer'
import DataTable, { type DataTableColumn } from './DataTable'
import Pagination from './Pagination'
import StatusBadge from './StatusBadge'
import CustomerCell from './CustomerCell'

interface CustomersTableProps {
  customers: Customer[]
  activeTab: string
  onCountsChange: (counts: Record<string, number>) => void
  onExportDataChange: (data: Customer[], selectedIds: Set<string>) => void
}

type SortKey = 'name' | 'location' | 'phone' | 'date' | 'status'

const baseCounts = { All: 983, Active: 968, Blocked: 15 }

function parseCustomerDate(value: string): number {
  const [day, month, shortYear] = value.split('.').map(Number)
  return new Date(2000 + shortYear, month - 1, day).getTime()
}

export default function CustomersTable({
  customers,
  activeTab,
  onCountsChange,
  onExportDataChange,
}: CustomersTableProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [pageState, setPageState] = useState({ tab: activeTab, page: 1 })
  const [pageSize, setPageSize] = useState(10)
  const page = pageState.tab === activeTab ? pageState.page : 1

  const matchingCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return customers.filter((customer) =>
      !normalized ||
      [customer.name, customer.email, customer.location, customer.phone]
        .some((value) => value.toLowerCase().includes(normalized)),
    )
  }, [customers, query])

  const filteredCustomers = useMemo(
    () => matchingCustomers.filter((customer) => activeTab === 'All' || customer.status === activeTab),
    [activeTab, matchingCustomers],
  )

  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers]
    if (sortKey) {
      sorted.sort((first, second) => {
        const comparison = sortKey === 'date'
          ? parseCustomerDate(first.date) - parseCustomerDate(second.date)
          : first[sortKey].localeCompare(second[sortKey], undefined, { numeric: true })
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }
    return sorted
  }, [filteredCustomers, sortDirection, sortKey])
  const visibleCustomers = sortedCustomers.slice((page - 1) * pageSize, page * pageSize)

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const allSelected = visibleCustomers.length > 0 && visibleCustomers.every((customer) => selected.has(customer.id))
  const someSelected = visibleCustomers.some((customer) => selected.has(customer.id))

  useEffect(() => {
    onExportDataChange(sortedCustomers, new Set(selected))
  }, [onExportDataChange, selected, sortedCustomers])

  const tabCounts = useMemo(() => {
    if (!query.trim()) return baseCounts
    return {
      All: matchingCustomers.length,
      Active: matchingCustomers.filter((customer) => customer.status === 'Active').length,
      Blocked: matchingCustomers.filter((customer) => customer.status === 'Blocked').length,
    }
  }, [matchingCustomers, query])

  useEffect(() => onCountsChange(tabCounts), [onCountsChange, tabCounts])
  function changePage(nextPage: number) {
    setPageState({ tab: activeTab, page: Math.max(1, Math.min(nextPage, pageCount)) })
  }

  function toggleAll() {
    const next = new Set(selected)
    if (allSelected) visibleCustomers.forEach((customer) => next.delete(customer.id))
    else visibleCustomers.forEach((customer) => next.add(customer.id))
    setSelected(next)
  }

  function toggleCustomer(id: string) {
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

  const columns: DataTableColumn<Customer>[] = [
    { key: 'name', label: 'Customer name', render: (customer) => <CustomerCell customer={customer} /> },
    {
      key: 'location',
      label: 'Location',
      render: (customer) => <span className="whitespace-nowrap text-[12px] text-[#8A8A8A]">{customer.location}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (customer) => <span className="whitespace-nowrap text-[12px] text-[#333]">{customer.phone}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      render: (customer) => <span className="whitespace-nowrap text-[12px] text-[#8A8A8A]">{customer.date}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (customer) => <StatusBadge status={customer.status} />,
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      headerClassName: 'w-8',
      cellClassName: 'w-8 pr-1',
      render: (customer) => (
        <button
          type="button"
          aria-label={`More actions for ${customer.name}`}
          className="text-[#9A9A9A] hover:text-[#555]"
        >
          <MoreVertical size={15} />
        </button>
      ),
    },
  ]

  return (
    <section className="rounded-lg border border-[#EDEDED] bg-white p-4">
      <div className="relative mb-3 flex items-center justify-between gap-3">
        <label className="flex h-8 w-full max-w-[310px] items-center gap-2 rounded-full border border-[#E9E9E9] px-3 text-[#929292]">
          <Search size={14} />
          <input
            aria-label="Search customers"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPageState({ tab: activeTab, page: 1 })
            }}
            placeholder="Search customer…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-ink outline-none placeholder:text-[#A0A0A0]"
          />
          <button
            type="button"
            aria-label="Customer filters"
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
        rows={visibleCustomers}
        columns={columns}
        getRowId={(customer) => customer.id}
        getRowLabel={(customer) => `Select customer ${customer.name}`}
        selected={selected}
        onToggleRow={toggleCustomer}
        onToggleAll={toggleAll}
        allSelected={allSelected}
        someSelected={someSelected}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key) => updateSort(key as SortKey)}
        emptyMessage="No customers found"
        selectAllLabel="Select all visible customers"
      />

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2 text-[10px] text-[#858585]">
          <label className="relative">
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPageState({ tab: activeTab, page: 1 })
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
            Showing {filteredCustomers.length === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, filteredCustomers.length)} of {filteredCustomers.length}
          </span>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} />
      </footer>
    </section>
  )
}
