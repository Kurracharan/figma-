import { CircleCheck, ImageIcon } from 'lucide-react'
import type { Product } from '../types/product'
import { formatProductDate, formatProductPrice } from '../utils/productFilters'
import StatusBadge from './StatusBadge'

interface ProductCardProps {
  product: Product
  selected: boolean
  onToggleSelected: (id: string) => void
  onViewProduct: (product: Product, trigger: HTMLElement) => void
}

export default function ProductCard({
  product,
  selected,
  onToggleSelected,
  onViewProduct,
}: ProductCardProps) {
  return (
    <article
      className={`h-[250px] overflow-hidden rounded-[10px] bg-white transition-shadow hover:shadow-sm ${
        selected
          ? 'border-[1.5px] border-primary hover:border-primary'
          : 'border border-[#E5E5E5] hover:border-[#D5D5D5]'
      }`}
    >
      <div className="relative flex h-[174px] items-center justify-center bg-white">
        <button
          type="button"
          aria-label={`View ${product.name}`}
          onClick={(event) => onViewProduct(product, event.currentTarget)}
          className="absolute inset-0 grid place-items-center"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt=""
              className="h-full w-full object-contain p-4"
            />
          ) : (
            <ImageIcon size={48} strokeWidth={1} className="text-[#BDBDBD]" aria-hidden="true" />
          )}
        </button>
        <div className="absolute left-[10px] top-[10px] z-10">
          <StatusBadge status={product.status} />
        </div>
        <button
          type="button"
          aria-label={`${selected ? 'Deselect' : 'Select'} ${product.name}`}
          aria-pressed={selected}
          onClick={() => onToggleSelected(product.id)}
          className="absolute right-[10px] top-[10px] z-10 grid h-6 w-6 place-items-center rounded-full text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E] focus-visible:ring-offset-1"
        >
          {selected ? (
            <CircleCheck size={18} strokeWidth={1.8} />
          ) : (
            <span className="h-[15px] w-[15px] rounded-full border border-[#BEBEBE] bg-white" />
          )}
        </button>
      </div>
      <div className="h-px bg-[#EDEDED]" />
      <div className="p-[10px]">
        <button
          type="button"
          onClick={(event) => onViewProduct(product, event.currentTarget)}
          className="m-0 block h-[34px] w-full line-clamp-2 overflow-hidden text-left text-[12px] font-normal leading-[17px] text-ink"
        >
          {product.name}
        </button>
        <div className="mt-1 flex items-center justify-between gap-2 text-[10px] leading-4">
          <span className="shrink-0 text-muted">{formatProductDate(product.date)}</span>
          <span className="min-w-0 truncate text-[#777]">{product.category}</span>
          <span className="shrink-0 text-[#555]">{formatProductPrice(product.price)}</span>
        </div>
      </div>
    </article>
  )
}
