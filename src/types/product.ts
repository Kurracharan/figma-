export type ProductStatus = 'Available' | 'Disabled'

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  productNo: string
  category: string
  date: Date
  price: number
  status: ProductStatus
  imageUrl?: string
  description?: string
  discount?: number
  tags?: string[]
  sku?: string
  images?: string[]
  specs?: ProductSpec[]
  unitPrice?: number
}

export interface UploadedImage {
  id: string
  url: string
  status: 'uploading' | 'done'
}

export interface NewProductForm {
  name: string
  description: string
  category: string
  price: number | null
  discount: number | null
  images: UploadedImage[]
  tags: string[]
}

export interface ProductFilters {
  category: string
  status: 'All' | 'Available' | 'Disabled'
  dateFrom: string
  dateTo: string
  priceMin: number
  priceMax: number
}
