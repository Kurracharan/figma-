import { useEffect, useRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface DataTableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  headerClassName?: string
  cellClassName?: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  rows: T[]
  columns: DataTableColumn<T>[]
  getRowId: (row: T) => string
  selected: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: () => void
  allSelected: boolean
  someSelected: boolean
  sortKey: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (key: string) => void
  emptyMessage: string
  selectAllLabel?: string
  getRowLabel?: (row: T) => string
  rowTextClassName?: string
}

export default function DataTable<T>({
  rows,
  columns,
  getRowId,
  selected,
  onToggleRow,
  onToggleAll,
  allSelected,
  someSelected,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage,
  selectAllLabel = 'Select all visible rows',
  getRowLabel,
  rowTextClassName = 'text-[10px]',
}: DataTableProps<T>) {
  const selectAllRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected
    }
  }, [allSelected, someSelected])

  const checkbox =
    'h-[15px] w-[15px] cursor-pointer rounded-[3px] accent-primary focus:ring-2 focus:ring-[#B9EE8E]'

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead>
          <tr className="h-9 border-b border-[#EDEDED] text-[9px] font-medium uppercase tracking-[0.045em] text-[#999]">
            <th className="print-select-column w-9 pl-2">
              <input
                ref={selectAllRef}
                type="checkbox"
                aria-label={selectAllLabel}
                checked={allSelected}
                onChange={onToggleAll}
                className={checkbox}
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`whitespace-nowrap px-2 ${column.headerClassName ?? ''}`}
              >
                {column.sortable === false ? (
                  column.label
                ) : (
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap text-left font-medium uppercase text-[#999]"
                  >
                    {column.label}
                    <ChevronDown
                      size={11}
                      className={sortKey === column.key && sortDirection === 'desc' ? 'rotate-180' : ''}
                    />
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row)
            const isSelected = selected.has(id)
            return (
              <tr
                key={id}
                className={`h-[43px] border-b border-[#F0F0F0] ${rowTextClassName} last:border-b-0 ${
                  isSelected ? 'bg-[#F7F7F7]' : 'bg-white'
                }`}
              >
                <td className="print-select-column pl-2">
                  <input
                    type="checkbox"
                    aria-label={getRowLabel?.(row) ?? `Select row ${id}`}
                    checked={isSelected}
                    onChange={() => onToggleRow(id)}
                    className={checkbox}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className={`px-2 ${column.cellClassName ?? ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="h-20 text-center text-[11px] text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
