import { useCallback, useEffect, useRef, useState } from 'react'
import { Heart, X } from 'lucide-react'
import type { Product } from '../types/product'
import { getProductDetails } from '../utils/productDetails'
import ImageGallery from './ImageGallery'
import QuantityStepper from './QuantityStepper'
import SpecList from './SpecList'

interface ProductDetailsModalProps {
  open: boolean
  product: Product | null
  session: number
  onClose: () => void
  onAddToCart: () => number
}

export default function ProductDetailsModal({
  open,
  product,
  session,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [quantityState, setQuantityState] = useState({ session, value: 1 })
  const [favorite, setFavorite] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimeout = useRef<number | null>(null)

  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    if (!open || !product) return
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !modalRef.current) return

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [close, open, product])

  useEffect(
    () => () => {
      if (toastTimeout.current !== null) window.clearTimeout(toastTimeout.current)
    },
    [],
  )

  if (!product) return null

  const details = getProductDetails(product)
  const quantity = quantityState.session === session ? quantityState.value : 1
  const unitPrice = details.unitPrice
  const totalPrice = unitPrice * quantity

  function addToCart() {
    const count = onAddToCart()
    setCartCount(count)
    setToastVisible(true)
    if (toastTimeout.current !== null) window.clearTimeout(toastTimeout.current)
    toastTimeout.current = window.setTimeout(() => setToastVisible(false), 2000)
  }

  function changeQuantity(value: number) {
    setQuantityState({ session, value })
  }

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[120] flex justify-center overflow-y-auto bg-black/40 px-4 pt-[70px] transition-opacity duration-150 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        aria-hidden={!open}
        inert={!open}
        className={`relative mb-8 h-fit max-h-[90vh] w-[690px] max-w-full overflow-y-auto rounded-lg bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-transform duration-150 ease-out sm:p-[30px] ${
          open ? 'scale-100' : 'scale-[0.98]'
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-md border border-[#EAEAEA] bg-white text-[#333] hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
        >
          <X size={12} />
        </button>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10">
          <ImageGallery key={product.id} name={details.name} images={details.images} />
          <div className="min-w-0 pt-1">
            <h2
              id="product-details-title"
              className="mb-0 mt-0 text-[14px] font-medium leading-5 text-ink"
            >
              {details.name}
            </h2>
            <p className="mb-0 mt-1 text-[11px] text-muted">SKU: {details.sku}</p>
            <p className="mb-0 mt-4 text-[11px] leading-[1.5] text-[#333]">{details.description}</p>

            <div className="mt-5">
              <span className="mb-2 block text-[11px] text-muted">Quantity</span>
              <div className="flex items-center justify-between gap-4">
                <QuantityStepper quantity={quantity} onChange={changeQuantity} />
                <span className="text-[16px] font-medium text-ink">
                  ${totalPrice.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={addToCart}
                className="h-8 flex-1 rounded-md bg-primary text-[12px] font-medium text-white hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E] focus-visible:ring-offset-1"
              >
                Add to Cart
              </button>
              <button
                type="button"
                aria-label="Add to favorites"
                aria-pressed={favorite}
                onClick={() => setFavorite((current) => !current)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#3CCFBF] text-white hover:bg-[#29BFAF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E] focus-visible:ring-offset-1"
              >
                <Heart size={14} fill={favorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="mt-6">
              <SpecList specs={details.specs} />
            </div>
          </div>
        </div>
      </div>
      {toastVisible && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[130] rounded-lg bg-[#222] px-4 py-2.5 text-[12px] text-white shadow-lg"
        >
          Added to cart
        </div>
      )}
      <span className="sr-only" aria-live="polite">Items added to cart: {cartCount}</span>
    </div>
  )
}
