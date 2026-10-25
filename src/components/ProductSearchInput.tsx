import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Product, ProductFilters } from '../types/product'
import { EMPTY_PRODUCT_FILTERS } from '../utils/productFilters'

interface ProductSearchInputProps {
  products: Product[]
  query: string
  onQueryChange: (query: string) => void
  filterOpen: boolean
  filters: ProductFilters
  onFilterToggle: () => void
}

export default function ProductSearchInput({
  products,
  query,
  onQueryChange,
  filterOpen,
  filters,
  onFilterToggle,
}: ProductSearchInputProps) {
  const [focused, setFocused] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 150)
    return () => window.clearTimeout(timeout)
  }, [query])

  const suggestions = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLowerCase()
    if (!normalizedQuery || debouncedQuery !== query.trim()) return []

    const seen = new Set<string>()
    return products
      .map((product) => product.name)
      .filter((name) => {
        if (!name.toLowerCase().includes(normalizedQuery) || seen.has(name)) return false
        seen.add(name)
        return true
      })
      .slice(0, 4)
  }, [debouncedQuery, products, query])

  const showSuggestions = suggestionsOpen && query.trim().length > 0 && suggestions.length > 0
  const activeFilters = [
    filters.category !== EMPTY_PRODUCT_FILTERS.category,
    filters.status !== EMPTY_PRODUCT_FILTERS.status,
    filters.dateFrom !== EMPTY_PRODUCT_FILTERS.dateFrom ||
      filters.dateTo !== EMPTY_PRODUCT_FILTERS.dateTo,
    filters.priceMin !== EMPTY_PRODUCT_FILTERS.priceMin ||
      filters.priceMax !== EMPTY_PRODUCT_FILTERS.priceMax,
  ].some(Boolean)

  useEffect(() => {
    if (!suggestionsOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setSuggestionsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [suggestionsOpen])

  function chooseSuggestion(name: string) {
    onQueryChange(name)
    setSuggestionsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && showSuggestions) {
      event.preventDefault()
      setHighlightedIndex((current) =>
        current < 0 ? 0 : (current + 1) % suggestions.length,
      )
    } else if (event.key === 'ArrowUp' && showSuggestions) {
      event.preventDefault()
      setHighlightedIndex((current) =>
        current < 0 ? suggestions.length - 1 : (current - 1 + suggestions.length) % suggestions.length,
      )
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (showSuggestions && highlightedIndex >= 0) {
        chooseSuggestion(suggestions[highlightedIndex])
      } else {
        setSuggestionsOpen(false)
        setHighlightedIndex(-1)
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (suggestionsOpen) {
        setSuggestionsOpen(false)
        setHighlightedIndex(-1)
      } else if (query) {
        onQueryChange('')
        setHighlightedIndex(-1)
        inputRef.current?.focus()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      data-product-search
      className="relative z-30 w-full min-w-0 max-w-[310px] flex-1"
    >
      <div
        className={`flex h-8 items-center gap-2 px-3 text-[#929292] ${
          focused || query
            ? 'rounded-none border-x-0 border-b-[1.5px] border-t-0 border-primary'
            : 'rounded-full border border-[#E9E9E9]'
        }`}
      >
        <Search size={14} className="shrink-0" />
        <input
          ref={inputRef}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          value={query}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            onQueryChange(event.target.value)
            setSuggestionsOpen(event.target.value.trim().length > 0)
            setHighlightedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products…"
          className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[12px] text-ink caret-primary outline-none placeholder:text-[#A0A0A0] focus:ring-0"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onQueryChange('')
              setSuggestionsOpen(false)
              setHighlightedIndex(-1)
              inputRef.current?.focus()
            }}
            className="grid h-6 w-5 shrink-0 place-items-center rounded text-[#929292] hover:bg-[#F0F0F0]"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="button"
          data-filter-trigger
          aria-label="Product filters"
          aria-haspopup="dialog"
          aria-expanded={filterOpen}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setSuggestionsOpen(false)
            setHighlightedIndex(-1)
            onFilterToggle()
          }}
          className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-md text-[#929292] ${
            filterOpen ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'
          }`}
        >
          <SlidersHorizontal size={14} />
          {activeFilters && (
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </button>
      </div>
      {showSuggestions && (
        <div
          role="listbox"
          aria-label="Product suggestions"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {suggestions.map((name, index) => (
            <button
              type="button"
              role="option"
              aria-selected={highlightedIndex === index}
              key={name}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => chooseSuggestion(name)}
              className={`flex h-8 w-full items-center rounded-lg px-3 text-left text-[12px] text-[#333] ${
                highlightedIndex === index ? 'bg-[#F3F3F3]' : 'hover:bg-[#F3F3F3]'
              }`}
            >
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
