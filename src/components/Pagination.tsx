<<<<<<< HEAD
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const disabled = pageCount <= 1
  const pageNumbers = pageCount <= 5
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : [1, 2, 3, -1, pageCount]

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="First page"
        disabled={disabled || page === 1}
        onClick={() => onPageChange(1)}
        className="grid h-8 w-8 place-items-center rounded-md bg-pale-green text-primary disabled:opacity-35"
      >
        <ChevronsLeft size={14} />
      </button>
      <button
        type="button"
        aria-label="Previous page"
        disabled={disabled || page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="grid h-8 w-8 place-items-center rounded-md bg-pale-green text-primary disabled:opacity-35"
      >
        <ChevronLeft size={14} />
      </button>
      {pageNumbers.map((number, index) =>
        number === -1 ? (
          <span key={`ellipsis-${index}`} className="grid h-8 w-7 place-items-center text-muted">
            …
          </span>
        ) : (
          <button
            type="button"
            key={number}
            aria-label={`Page ${number}`}
            aria-current={page === number ? 'page' : undefined}
            onClick={() => onPageChange(number)}
            className={`grid h-8 min-w-8 place-items-center rounded-md px-2 ${
              page === number ? 'bg-primary text-white' : 'text-[#666] hover:bg-[#F1F1F1]'
            }`}
          >
            {number}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={disabled || page === pageCount}
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        className="grid h-8 w-8 place-items-center rounded-md bg-pale-green text-primary disabled:opacity-35"
      >
        <ChevronRight size={14} />
      </button>
      <button
        type="button"
        aria-label="Last page"
        disabled={disabled || page === pageCount}
        onClick={() => onPageChange(pageCount)}
        className="grid h-8 w-8 place-items-center rounded-md bg-pale-green text-primary disabled:opacity-35"
      >
        <ChevronsRight size={14} />
      </button>
    </nav>
  )
}
=======
import Icon from './Icon'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      
      if (currentPage < totalPages - 2) pages.push('...')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        )
      }
      return (
        <button
          key={`page-${page}`}
          type="button"
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page as number)}
        >
          {page}
        </button>
      )
    })
  }

  return (
    <div className="pagination-container">
      <div className="pagination-size-selector">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="pagination-select"
          aria-label="Items per page"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="pagination-info">
          Showing {startItem} &ndash; {endItem} of {totalItems}
        </span>
      </div>

      <div className="pagination-actions">
        <button
          type="button"
          className="pagination-btn arrow-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <Icon name="chevrons-left" size={14} />
        </button>
        <button
          type="button"
          className="pagination-btn arrow-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" size={14} />
        </button>

        {renderPageNumbers()}

        <button
          type="button"
          className="pagination-btn arrow-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <Icon name="chevron-right" size={14} />
        </button>
        <button
          type="button"
          className="pagination-btn arrow-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <Icon name="chevrons-right" size={14} />
        </button>
      </div>
    </div>
  )
}

export default Pagination

>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
