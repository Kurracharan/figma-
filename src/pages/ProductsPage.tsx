import { Plus } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import AddProductDrawer from '../components/AddProductDrawer'
import ExportMenu, { type ExportColumn } from '../components/ExportMenu'
import Header from '../components/Header'
import ProductDetailsModal from '../components/ProductDetailsModal'
import ProductsTable from '../components/ProductsTable'
import Sidebar from '../components/Sidebar'
import Tabs, { type ProductFilter, type ViewMode } from '../components/Tabs'
import type { NewProductForm, Product, ProductFilters } from '../types/product'
import {
  EMPTY_PRODUCT_FILTERS,
  filterProducts,
} from '../utils/productFilters'

const products: Product[] = [
  {
    id: 'p1',
    name: 'Apple iPhone 11 Pro Max 256GB Space Gray',
    productNo: '#790841',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 2500,
    status: 'Available',
  },
  {
    id: 'p2',
    name: 'Apple iPhone 11 Pro Max 256GB Space Gray',
    productNo: '#790842',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 2500,
    status: 'Available',
  },
  {
    id: 'p3',
    name: 'Apple iPhone 11 Pro Max 256GB Space Gray',
    productNo: '#790843',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 2500,
    status: 'Disabled',
  },
  {
    id: 'p4',
    name: 'Apple iPhone 11 Pro Max 256GB Space Gray',
    productNo: '#790844',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 2500,
    status: 'Disabled',
  },
  {
    id: 'p5',
    name: 'Apple iPhone 11 Pro Max 256GB Space Gray',
    productNo: '#790845',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 2500,
    status: 'Available',
  },
  {
    id: 'p6',
    name: 'Apple iPhone 11 Pro Max 64GB Midnight Green',
    productNo: '#790846',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 1500,
    status: 'Available',
  },
  {
    id: 'p7',
    name: 'MacBook Pro 15 Retina Touch Bar MV902',
    productNo: '#790847',
    category: 'Notebook',
    date: new Date(2020, 8, 12),
    price: 2500,
    status: 'Available',
  },
  {
    id: 'p8',
    name: 'Apple Watch Series 5 Edition GPS + Cellular',
    productNo: '#790848',
    category: 'Watch',
    date: new Date(2020, 8, 12),
    price: 1250,
    status: 'Available',
  },
  {
    id: 'p9',
    name: 'Apple iPhone 11 Pro 512GB Space Gray',
    productNo: '#790849',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 2200,
    status: 'Available',
  },
  {
    id: 'p10',
    name: 'Apple iPhone 11 64GB Purple',
    productNo: '#790850',
    sku: '0547081',
    category: 'Phone',
    date: new Date(2020, 8, 12),
    price: 699,
    unitPrice: 699,
    status: 'Available',
    description:
      'A new dual-camera system captures more of what you see and love. The fastest chip ever in a smartphone and all-day battery life let you do more and charge less. And the highest-quality video in a smartphone, so your memories look better than ever.',
    images: [],
    specs: [
      { label: 'Display', value: '6.1-inch' },
      { label: 'Chip', value: 'A13 Bionic chip' },
      { label: 'Camera', value: 'Dual 12MP Ultra Wide' },
      { label: 'OS', value: 'iOS 13' },
      { label: 'Capacity', value: '64GB' },
    ],
  },
]

function createProductNumber(): string {
  return `#${Math.floor(100000 + Math.random() * 900000)}`
}

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(products)
  const [exportData, setExportData] = useState<Product[]>(products)
  const [exportSelectedIds, setExportSelectedIds] = useState<Set<string>>(new Set(['p2', 'p3', 'p4']))
  const [activeTab, setActiveTab] = useState<ProductFilter>('All')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['p2', 'p3', 'p4']))
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_PRODUCT_FILTERS)
  const [query, setQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(products[9])
  const [detailsSession, setDetailsSession] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const detailsOpenerRef = useRef<HTMLElement | null>(null)
  const filteredProducts = useMemo(
    () => filterProducts(productList, query, filters),
    [filters, productList, query],
  )
  const exportColumns: ExportColumn[] = [
    { key: 'name', label: 'Product name' },
    { key: 'productNo', label: 'Product no.' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
  ]
  const updateExportData = useCallback((data: Product[], selectedIds: Set<string>) => {
    setExportData(data)
    setExportSelectedIds(selectedIds)
  }, [])
  const counts = useMemo<Record<ProductFilter, number>>(
    () => ({
      All: filteredProducts.length,
      Available: filteredProducts.filter((product) => product.status === 'Available').length,
      Disabled: filteredProducts.filter((product) => product.status === 'Disabled').length,
    }),
    [filteredProducts],
  )
  const addedProducts = productList.slice(0, productList.length - products.length)
  const hasActiveProductFilters =
    Boolean(query) ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.priceMin !== EMPTY_PRODUCT_FILTERS.priceMin ||
    filters.priceMax !== EMPTY_PRODUCT_FILTERS.priceMax

  const closeDrawer = useCallback(() => {
    document.getElementById('add-product-trigger')?.focus()
    setDrawerOpen(false)
  }, [])

  function openDetails(product: Product, trigger: HTMLElement) {
    detailsOpenerRef.current = trigger
    setDetailsProduct(product)
    setDetailsSession((current) => current + 1)
    setDetailsOpen(true)
  }

  const closeDetails = useCallback(() => {
    setDetailsOpen(false)
    detailsOpenerRef.current?.focus()
  }, [])

  function addToCart() {
    const nextCount = cartCount + 1
    setCartCount(nextCount)
    return nextCount
  }

  function addProduct(form: NewProductForm) {
    const newProduct: Product = {
      id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name,
      productNo: createProductNumber(),
      category: form.category,
      date: new Date(),
      price: form.price ?? 0,
      unitPrice: form.price ?? 0,
      status: 'Available',
      imageUrl: form.images[0]?.url,
      images: form.images.map((image) => image.url),
      sku: createProductNumber().slice(1),
      description: form.description,
      discount: form.discount ?? undefined,
      tags: form.tags,
    }
    setProductList((current) => [newProduct, ...current])
    document.getElementById('add-product-trigger')?.focus()
    setDrawerOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="m-0 text-[20px] font-medium leading-tight text-ink">Products</h1>
            <div className="flex items-center gap-2">
              <ExportMenu data={exportData} columns={exportColumns} filename="products" selectedIds={exportSelectedIds} getRowId={(product) => product.id} />
              <button
                type="button"
                id="add-product-trigger"
                aria-label="Add product"
                onClick={() => setDrawerOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white hover:bg-[#187926]"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              counts={hasActiveProductFilters ? counts : {
                All: 283 + addedProducts.length,
                Available: 268 + addedProducts.filter((product) => product.status === 'Available').length,
                Disabled: 15 + addedProducts.filter((product) => product.status === 'Disabled').length,
              }}
            />
          </div>
          <ProductsTable
            products={productList}
            statusFilter={activeTab}
            filters={filters}
            onFiltersChange={setFilters}
            query={query}
            onQueryChange={setQuery}
            viewMode={viewMode}
            selected={selected}
            onSelectedChange={setSelected}
            onExportDataChange={updateExportData}
            onViewProduct={openDetails}
          />
        </main>
      </div>
      <AddProductDrawer open={drawerOpen} onClose={closeDrawer} onSave={addProduct} />
      <ProductDetailsModal
        open={detailsOpen}
        product={detailsProduct}
        session={detailsSession}
        onClose={closeDetails}
        onAddToCart={addToCart}
      />
      <span className="sr-only" aria-live="polite">Cart items: {cartCount}</span>
    </div>
  )
}
