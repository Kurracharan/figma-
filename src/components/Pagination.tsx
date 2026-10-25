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
