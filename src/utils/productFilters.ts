import type { Product, ProductFilters } from '../types/product'

export const PRICE_MIN = 500
export const PRICE_MAX = 5500
export const DEFAULT_DATE = '2020-07-12'

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  category: 'All',
  status: 'Available',
  dateFrom: DEFAULT_DATE,
  dateTo: DEFAULT_DATE,
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
}

export const EMPTY_PRODUCT_FILTERS: ProductFilters = {
  ...DEFAULT_PRODUCT_FILTERS,
  status: 'All',
  dateFrom: '',
  dateTo: '',
}

export function filterProducts(
  products: Product[],
  query: string,
  filters: ProductFilters,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase()
  const from = filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00`) : null
  const to = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59.999`) : null

  return products.filter((product) => {
    const productTime = product.date.getTime()
    return (
      product.name.toLowerCase().includes(normalizedQuery) &&
      (filters.category === 'All' || product.category === filters.category) &&
      (filters.status === 'All' || product.status === filters.status) &&
      (!from || productTime >= from.getTime()) &&
      (!to || productTime <= to.getTime()) &&
      product.price >= filters.priceMin &&
      product.price <= filters.priceMax
    )
  })
}

export function formatProductDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}

export function formatProductPrice(price: number): string {
  return `$${price.toLocaleString('de-DE')}`
}
