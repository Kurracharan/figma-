import type { Product, ProductSpec } from '../types/product'

export const SAMPLE_PRODUCT_DESCRIPTION =
  'A new dual-camera system captures more of what you see and love. The fastest chip ever in a smartphone and all-day battery life let you do more and charge less. And the highest-quality video in a smartphone, so your memories look better than ever.'

export const SAMPLE_PRODUCT_SPECS: ProductSpec[] = [
  { label: 'Display', value: '6.1-inch' },
  { label: 'Chip', value: 'A13 Bionic chip' },
  { label: 'Camera', value: 'Dual 12MP Ultra Wide' },
  { label: 'OS', value: 'iOS 13' },
  { label: 'Capacity', value: '64GB' },
]

export function getProductDetails(product: Product) {
  return {
    name: product.name,
    sku: product.sku ?? product.productNo.replace(/^#/, ''),
    description: product.description || SAMPLE_PRODUCT_DESCRIPTION,
    images: product.images ?? (product.imageUrl ? [product.imageUrl] : []),
    specs: product.specs ?? SAMPLE_PRODUCT_SPECS,
    unitPrice: product.unitPrice ?? product.price,
  }
}
