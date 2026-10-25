import { ChevronDown } from 'lucide-react'
import type { Product } from '../types/product'
import Pagination from './Pagination'
import ProductCard from './ProductCard'

interface ProductsGridProps {
  products: Product[]
  selected: Set<string>
  page: number
  pageCount: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onToggleSelected: (id: string) => void
  onViewProduct: (product: Product, trigger: HTMLElement) => void
}

export default function ProductsGrid({
  products,
  selected,
  page,
  pageCount,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onToggleSelected,
  onViewProduct,
}: ProductsGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selected.has(product.id)}
            onToggleSelected={onToggleSelected}
            onViewProduct={onViewProduct}
          />
        ))}
        {products.length === 0 && (
          <p className="col-span-full py-10 text-center text-[11px] text-muted">
            No products found
          </p>
        )}
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2 text-[10px] text-[#858585]">
          <label className="relative">
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-8 appearance-none rounded-md border border-[#E7E7E7] bg-white py-0 pl-3 pr-7 text-[10px] text-[#555] outline-none"
            >
              {[8, 10, 20].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
            />
          </label>
          <span>
            Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, totalCount)} of {totalCount}
          </span>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
      </footer>
    </>
  )
}
