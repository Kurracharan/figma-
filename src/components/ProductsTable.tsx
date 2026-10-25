<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, MoreVertical } from 'lucide-react'
import type { Product, ProductFilters } from '../types/product'
import {
  filterProducts,
  formatProductDate,
  formatProductPrice,
} from '../utils/productFilters'
import type { ViewMode } from './Tabs'
import DataTable, { type DataTableColumn } from './DataTable'
import FilterPopover from './FilterPopover'
import Pagination from './Pagination'
import ProductSearchInput from './ProductSearchInput'
import ProductsGrid from './ProductsGrid'
import StatusBadge from './StatusBadge'

interface ProductsTableProps {
  products: Product[]
  statusFilter: string
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  query: string
  onQueryChange: (query: string) => void
  viewMode: ViewMode
  selected: Set<string>
  onSelectedChange: (selected: Set<string>) => void
  onExportDataChange: (data: Product[], selectedIds: Set<string>) => void
  onViewProduct: (product: Product, trigger: HTMLElement) => void
}

type SortKey = 'name' | 'productNo' | 'category' | 'date' | 'price' | 'status'

export default function ProductsTable({
  products,
  statusFilter,
  filters,
  onFiltersChange,
  query,
  onQueryChange,
  viewMode,
  selected,
  onSelectedChange,
  onExportDataChange,
  onViewProduct,
}: ProductsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSizes, setPageSizes] = useState({ list: 10, grid: 8 })
  const [filterOpen, setFilterOpen] = useState(false)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)
  const [previousStatusFilter, setPreviousStatusFilter] = useState(statusFilter)
  const [previousViewMode, setPreviousViewMode] = useState(viewMode)
  const pageSize = pageSizes[viewMode]

  if (previousStatusFilter !== statusFilter) {
    setPreviousStatusFilter(statusFilter)
    setPage(1)
  }

  if (previousViewMode !== viewMode) {
    setPreviousViewMode(viewMode)
    setPage(1)
  }

  const filtered = useMemo(() => {
    const matching = filterProducts(products, query, filters).filter(
      (product) => statusFilter === 'All' || product.status === statusFilter,
    )
    if (!sortKey) return matching
    return matching.sort((first, second) => {
      const firstValue = first[sortKey]
      const secondValue = second[sortKey]
      const comparison =
        firstValue instanceof Date && secondValue instanceof Date
          ? firstValue.getTime() - secondValue.getTime()
          : typeof firstValue === 'number' && typeof secondValue === 'number'
            ? firstValue - secondValue
            : String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true })
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filters, products, query, sortDirection, sortKey, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)
  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((product) => selected.has(product.id))
  const someVisibleSelected = visibleRows.some((product) => selected.has(product.id))

  useEffect(() => {
    onExportDataChange(filtered, new Set(selected))
  }, [filtered, onExportDataChange, selected])

  useEffect(() => {
    if (!filterOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Element &&
        !event.target.closest('[data-filter-popover], [data-filter-trigger]')
      ) {
        setFilterOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setFilterOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [filterOpen])

  function toggleAll() {
    const next = new Set(selected)
    if (allVisibleSelected) visibleRows.forEach((product) => next.delete(product.id))
    else visibleRows.forEach((product) => next.add(product.id))
    onSelectedChange(next)
  }

  function toggleProduct(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectedChange(next)
  }

  function changePageSize(size: number) {
    setPageSizes((current) => ({ ...current, [viewMode]: size }))
    setPage(1)
  }

  function changeSort(key: SortKey) {
    if (sortKey === key) setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const tableColumns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product name',
      cellClassName: 'max-w-[285px]',
      render: (product) => (
        <button
          type="button"
          onClick={(event) => onViewProduct(product, event.currentTarget)}
          className="block max-w-full truncate text-left font-medium text-[#292929] hover:text-primary"
        >
          {product.name}
        </button>
      ),
    },
    { key: 'productNo', label: 'Product no.', render: (product) => <span className="whitespace-nowrap text-[#858585]">{product.productNo}</span> },
    { key: 'category', label: 'Category', render: (product) => <span className="whitespace-nowrap text-[#555]">{product.category}</span> },
    { key: 'date', label: 'Date', render: (product) => <span className="whitespace-nowrap text-[#858585]">{formatProductDate(product.date)}</span> },
    { key: 'price', label: 'Price', render: (product) => <span className="whitespace-nowrap text-[#555]">{formatProductPrice(product.price)}</span> },
    { key: 'status', label: 'Status', render: (product) => <StatusBadge status={product.status} /> },
    {
      key: 'actions',
      label: '',
      sortable: false,
      headerClassName: 'w-8',
      cellClassName: 'w-8 pr-1',
      render: (product) => (
        <div className="relative text-right">
          <button
            type="button"
            aria-label={`More actions for ${product.name}`}
            aria-expanded={actionMenuId === product.id}
            onClick={() => setActionMenuId((current) => current === product.id ? null : product.id)}
            className="text-[#9A9A9A]"
          >
            <MoreVertical size={15} />
          </button>
          {actionMenuId === product.id && (
            <div className="absolute right-5 top-1 z-20 w-28 rounded-lg border border-[#EDEDED] bg-white p-1 text-left shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
              <button
                type="button"
                onClick={(event) => {
                  setActionMenuId(null)
                  const kebab = event.currentTarget
                    .closest('td')
                    ?.querySelector<HTMLButtonElement>(`button[aria-label="More actions for ${product.name}"]`)
                  onViewProduct(product, kebab ?? event.currentTarget)
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
    <section className="relative rounded-lg border border-[#EDEDED] bg-white p-4">
      <div className="relative mb-3 flex items-center justify-between gap-3">
        <ProductSearchInput
          products={products}
          query={query}
          onQueryChange={(nextQuery) => {
            onQueryChange(nextQuery)
            setPage(1)
          }}
          filterOpen={filterOpen}
          filters={filters}
          onFilterToggle={() => setFilterOpen((open) => !open)}
        />
        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-2 rounded-md border border-[#E9E9E9] px-3 text-[11px] text-[#555]"
        >
          Actions
          <ChevronDown size={13} className="text-muted" />
        </button>
        <FilterPopover
          open={filterOpen}
          onSave={(nextFilters) => {
            onFiltersChange(nextFilters)
            setPage(1)
            setFilterOpen(false)
          }}
        />
      </div>

      {viewMode === 'grid' ? (
        <ProductsGrid
          products={visibleRows}
          selected={selected}
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          totalCount={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={changePageSize}
          onToggleSelected={toggleProduct}
          onViewProduct={onViewProduct}
        />
      ) : (
      <>
      <DataTable
        rows={visibleRows}
        columns={tableColumns}
        getRowId={(product) => product.id}
        getRowLabel={(product) => `Select ${product.name}`}
        rowTextClassName="text-[10px]"
        selected={selected}
        onToggleRow={toggleProduct}
        onToggleAll={toggleAll}
        allSelected={allVisibleSelected}
        someSelected={someVisibleSelected}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key) => changeSort(key as SortKey)}
        emptyMessage="No products found"
        selectAllLabel="Select all visible products"
      />
      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2 text-[10px] text-[#858585]">
          <label className="relative">
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(event) => changePageSize(Number(event.target.value))}
              className="h-8 appearance-none rounded-md border border-[#E7E7E7] bg-white py-0 pl-3 pr-7 text-[10px] text-[#555] outline-none"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
          </label>
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </footer>
      </>
      )}
    </section>
  )
}
=======
import { useState } from 'react'
import Icon from './Icon'
import ProductFilterPanel from './ProductFilterPanel'

export interface ProductItem {
  id: string
  name: string
  productNo: string
  category: string
  date: string
  price: string
  status: 'Available' | 'Disabled'
}

interface ProductsTableProps {
  products: ProductItem[]
  selectedIds: string[]
  onToggleSelectAll: () => void
  onToggleSelectRow: (id: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onExport: () => void
}

function ProductsTable({
  products,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onExport,
}: ProductsTableProps) {
  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const isAllSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id))

  return (
    <div className="products-table-card">
      {/* Search & Actions Toolbar */}
      <div className="table-toolbar">
        <div className="search-box">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="toolbar-right">
          <ProductFilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
          <div className="product-actions-wrapper">
            <button
              type="button"
              className="toolbar-actions-btn"
              aria-expanded={isActionsOpen}
              aria-haspopup="menu"
              onClick={() => setIsActionsOpen((open) => !open)}
            >
              <Icon name="more" size={15} /> Actions
            </button>
            {isActionsOpen && (
              <div className="product-actions-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onToggleSelectAll()
                    setIsActionsOpen(false)
                  }}
                >
                  {isAllSelected ? 'Clear page selection' : 'Select all on page'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={selectedIds.length === 0}
                  onClick={() => {
                    onExport()
                    setIsActionsOpen(false)
                  }}
                >
                  Export selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="products-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                  />
                  <span className="checkmark" />
                </label>
              </th>
              <th>
                <div className="th-content">
                  PRODUCT NAME <Icon name="chevron-down" size={12} />
                </div>
              </th>
              <th>
                <div className="th-content">
                  PRODUCT NO. <Icon name="chevron-down" size={12} />
                </div>
              </th>
              <th>
                <div className="th-content">
                  CATEGORY <Icon name="chevron-down" size={12} />
                </div>
              </th>
              <th>
                <div className="th-content">
                  DATE <Icon name="chevron-down" size={12} />
                </div>
              </th>
              <th>
                <div className="th-content">
                  PRICE <Icon name="chevron-down" size={12} />
                </div>
              </th>
              <th>
                <div className="th-content">
                  STATUS <Icon name="chevron-down" size={12} />
                </div>
              </th>
              <th className="actions-col" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state-cell">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id)
                return (
                  <tr key={product.id} className={isSelected ? 'selected-row' : ''}>
                    <td className="checkbox-col">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelectRow(product.id)}
                        />
                        <span className="checkmark" />
                      </label>
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td className="muted-cell">{product.productNo}</td>
                    <td className="category-cell">{product.category}</td>
                    <td className="date-cell">{product.date}</td>
                    <td className="price-cell">{product.price}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          product.status === 'Available' ? 'available' : 'disabled'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="actions-col">
                      <div className="row-actions-wrapper">
                        <button
                          type="button"
                          className="icon-row-btn"
                          aria-label="Row actions"
                          onClick={() =>
                            setActiveActionsMenu(
                              activeActionsMenu === product.id ? null : product.id
                            )
                          }
                        >
                          <Icon name="more" size={16} />
                        </button>
                        {activeActionsMenu === product.id && (
                          <div className="row-menu-dropdown">
                            <button type="button">Edit Product</button>
                            <button type="button" className="text-danger">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsTable

>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
