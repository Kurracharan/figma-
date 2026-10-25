<<<<<<< HEAD
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
=======
import { useState, useMemo } from 'react'
import Icon from '../components/Icon'
import ProductsTable from '../components/ProductsTable'
import type { ProductItem } from '../components/ProductsTable'
import Pagination from '../components/Pagination'
import { downloadCsv } from '../utils/downloadCsv'

// Initial reference product templates to generate list of 100 products
const sampleTemplates: Array<{ name: string; category: string; status: 'Available' | 'Disabled'; price: string }> = [
  { name: 'MacBook Pro 15 Retina Touch Bar MV902', category: 'Notebook', status: 'Available', price: '$2.500' },
  { name: 'Apple Watch Series 5 Edition GPS + Cellular', category: 'Watch', status: 'Available', price: '$2.500' },
  { name: 'Apple iPhone 11 Pro Max 256GB Space Gray', category: 'Phone', status: 'Available', price: '$2.500' },
  { name: 'Apple Watch Series 5 Edition GPS + Cellular', category: 'Watch', status: 'Available', price: '$2.500' },
  { name: 'MacBook Pro 15 Retina Touch Bar MV902', category: 'Notebook', status: 'Disabled', price: '$2.500' },
  { name: 'Apple iPhone 11 Pro Max 64GB Midnight Green', category: 'Phone', status: 'Disabled', price: '$2.500' },
  { name: 'MacBook Pro 15 Retina Touch Bar MV902', category: 'Notebook', status: 'Available', price: '$2.500' },
  { name: 'Apple Watch Series 5 Edition GPS + Cellular', category: 'Watch', status: 'Available', price: '$2.500' },
  { name: 'iPad Pro 12.9-inch M1 Chip 256GB Space Gray', category: 'Tablet', status: 'Available', price: '$1.299' },
  { name: 'AirPods Max Wireless Headphones Silver', category: 'Audio', status: 'Available', price: '$549' },
]

const initialProducts: ProductItem[] = Array.from({ length: 100 }, (_, index) => {
  const tmpl = sampleTemplates[index % sampleTemplates.length]
  // Distribute 15 disabled items out of 100 to match reference counts
  const isDisabled = (index % 7 === 4 || index % 7 === 5) && index < 54
  return {
    id: `prod-${index + 1}`,
    name: tmpl.name,
    productNo: '#790841',
    category: tmpl.category,
    date: '12.09.20',
    price: tmpl.price,
    status: isDisabled ? 'Disabled' : 'Available',
  }
})

function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'disabled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')

  // Counts for tabs
  const allCount = products.length
  const availableCount = products.filter((p) => p.status === 'Available').length
  const disabledCount = products.filter((p) => p.status === 'Disabled').length
  const categories = Array.from(new Set(products.map((product) => product.category))).sort()

  // Filter products by tab & search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Tab filter
      if (activeTab === 'available' && product.status !== 'Available') return false
      if (activeTab === 'disabled' && product.status !== 'Disabled') return false
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesCategory = product.category.toLowerCase().includes(query)
        const matchesNo = product.productNo.toLowerCase().includes(query)
        return matchesName || matchesCategory || matchesNo
      }

      return true
    })
  }, [products, activeTab, categoryFilter, searchTerm])

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  // Handlers
  const handleToggleSelectAll = () => {
    const displayedIds = displayedProducts.map((p) => p.id)
    const isAllDisplayedSelected = displayedIds.every((id) => selectedIds.includes(id))

    if (isAllDisplayedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !displayedIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...displayedIds])))
    }
  }

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleExport = () => {
    const dataToExport = selectedIds.length > 0
      ? products.filter((p) => selectedIds.includes(p.id))
      : filteredProducts

    const headers = ['Product Name', 'Product No', 'Category', 'Date', 'Price', 'Status']
    const csvData = dataToExport.map((p) => ({
      'Product Name': p.name,
      'Product No': p.productNo,
      Category: p.category,
      Date: p.date,
      Price: p.price,
      Status: p.status,
    }))

    downloadCsv('products_list.csv', headers, csvData)
  }

  const handleExportOption = (option: 'print' | 'excel' | 'pdf' | 'csv') => {
    setIsExportOpen(false)

    if (option === 'print') {
      window.print()
    } else if (option === 'csv') {
      handleExport()
    }
  }

  const handleAddProduct = () => {
    if (!newProductName.trim() || !newProductCategory.trim() || !newProductPrice.trim()) return

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      productNo: `#${Math.floor(100000 + Math.random() * 900000)}`,
      category: newProductCategory.trim(),
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
      price: `$${Number(newProductPrice).toFixed(3)}`,
      status: 'Available',
    }

    setProducts((prev) => [newProduct, ...prev])
    setNewProductName('')
    setNewProductCategory('')
    setNewProductPrice('')
    setIsModalOpen(false)
  }

  return (
    <section className="products-page-shell" aria-labelledby="products-heading">
      {/* Top Header & Page Actions */}
      <div className="products-header">
        <div className="products-title-group">
          <h1 id="products-heading" className="products-title">
            Products
          </h1>
          {/* Sub-header Filter Tabs */}
          <div className="products-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('all')
                setCurrentPage(1)
              }}
            >
              All <span className="tab-badge">{allCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'available'}
              className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('available')
                setCurrentPage(1)
              }}
            >
              Available <span className="tab-badge">{availableCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'disabled'}
              className={`tab-btn ${activeTab === 'disabled' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('disabled')
                setCurrentPage(1)
              }}
            >
              Disabled <span className="tab-badge">{disabledCount}</span>
            </button>
          </div>
        </div>

        <div className="products-actions">
          <div className="export-menu-wrapper">
            <button
              type="button"
              className="btn-secondary"
              aria-expanded={isExportOpen}
              aria-haspopup="menu"
              onClick={() => setIsExportOpen((prev) => !prev)}
            >
              <Icon name="export" size={16} /> Export <Icon name="chevron-down" size={14} />
            </button>
            {isExportOpen && (
              <div className="export-menu" role="menu">
                {(['print', 'excel', 'pdf', 'csv'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="menuitem"
                    onClick={() => handleExportOption(option)}
                  >
                    {option === 'csv' ? 'CSV' : option[0].toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn-primary-green"
            onClick={() => setIsModalOpen(true)}
          >
            <Icon name="plus" size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Main Products List Table */}
      <ProductsTable
        products={displayedProducts}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        searchTerm={searchTerm}
        categories={categories}
        selectedCategory={categoryFilter}
        onCategoryChange={(category) => {
          setCategoryFilter(category)
          setCurrentPage(1)
        }}
        onExport={handleExport}
        onSearchChange={(term) => {
          setSearchTerm(term)
          setCurrentPage(1)
        }}
      />

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredProducts.length}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="add-product-modal-title">Add New Product</h3>
              <button
                type="button"
                className="icon-button small"
                onClick={() => setIsModalOpen(false)}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label htmlFor="modal-prod-name">Product Name</label>
                <input
                  id="modal-prod-name"
                  type="text"
                  placeholder="e.g. MacBook Pro 16 Inch"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="modal-prod-category">Category</label>
                <input
                  id="modal-prod-category"
                  type="text"
                  placeholder="e.g. Notebook"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="modal-prod-price">Price ($)</label>
                <input
                  id="modal-prod-price"
                  type="text"
                  placeholder="e.g. 2.500"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary-green"
                onClick={handleAddProduct}
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductsPage
>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
