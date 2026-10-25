import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { NewProductForm } from '../types/product'
import ImageUploader from './ImageUploader'
import PrefixedInput from './PrefixedInput'
import RichTextEditor from './RichTextEditor'
import Select from './Select'
import TagInput from './TagInput'

interface AddProductDrawerProps {
  open: boolean
  onClose: () => void
  onSave: (form: NewProductForm) => void
}

interface FormErrors {
  name?: string
  category?: string
  price?: string
  discount?: string
}

function createEmptyForm(): NewProductForm {
  return {
    name: 'Apple iPhone 11 Pro Max 64GB Midnight Green',
    description: '',
    category: 'Phone',
    price: 2500,
    discount: 15,
    images: [],
    tags: ['Apple', 'iPhone', '64GB'],
  }
}

export default function AddProductDrawer({ open, onClose, onSave }: AddProductDrawerProps) {
  const [form, setForm] = useState<NewProductForm>(createEmptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const drawerRef = useRef<HTMLElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef(form)

  useEffect(() => {
    formRef.current = form
  }, [form])

  const close = useCallback(() => {
    formRef.current.images.forEach((image) => URL.revokeObjectURL(image.url))
    setForm(createEmptyForm())
    setErrors({})
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    nameInputRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [contenteditable="true"], [tabindex="0"]',
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
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, close])

  function update<Key extends keyof NewProductForm>(key: Key, value: NewProductForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Product name is required.'
    if (!form.category.trim()) nextErrors.category = 'Category is required.'
    if (form.price === null || !Number.isFinite(form.price) || form.price <= 0) {
      nextErrors.price = 'Enter a price greater than 0.'
    }
    if (
      form.discount !== null &&
      (!Number.isFinite(form.discount) || form.discount < 0 || form.discount > 100)
    ) {
      nextErrors.discount = 'Discount must be between 0 and 100.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({ ...form, name: form.name.trim() })
    form.images.slice(1).forEach((image) => URL.revokeObjectURL(image.url))
    setForm(createEmptyForm())
    setErrors({})
  }

  function handleBackdropKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') close()
  }

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close add product drawer"
        tabIndex={open ? 0 : -1}
        onClick={close}
        onKeyDown={handleBackdropKeyDown}
        className={`absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        inert={!open}
        className={`absolute right-0 top-0 flex h-full w-full max-w-none flex-col overflow-y-auto bg-white p-5 transition-transform duration-200 ease-out min-[480px]:w-[320px] min-[480px]:max-w-[320px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <h2 id="add-product-title" className="mb-5 mt-0 text-[20px] font-medium leading-7 text-ink">
          Add Product
        </h2>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="product-name" className="mb-1.5 block text-[10px] text-muted">
                Product Name
              </label>
              <input
                ref={nameInputRef}
                id="product-name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
                className={`h-8 w-full rounded-full border bg-white px-3 text-[12px] text-ink outline-none focus:border-primary focus:ring-1 focus:ring-[#B9EE8E] ${
                  errors.name ? 'border-red-400' : 'border-[#E5E5E5]'
                }`}
              />
              {errors.name && <p className="mt-1 text-[10px] text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] text-muted">Description</label>
              <RichTextEditor
                value={form.description}
                onChange={(value) => update('description', value)}
              />
            </div>

            <Select
              id="new-product-category"
              label="Category"
              value={form.category}
              options={['Notebook', 'Watch', 'Phone']}
              onChange={(value) => update('category', value)}
              error={errors.category}
            />

            <div className="flex gap-3">
              <PrefixedInput
                id="new-product-price"
                label="Price"
                prefix="$"
                value={form.price}
                formatThousands
                onChange={(value) => update('price', value)}
                error={errors.price}
              />
              <PrefixedInput
                id="new-product-discount"
                label="Discount"
                prefix="%"
                value={form.discount}
                onChange={(value) => update('discount', value)}
                error={errors.discount}
              />
            </div>

            <ImageUploader
              images={form.images}
              onChange={(images) =>
                setForm((current) => ({
                  ...current,
                  images: typeof images === 'function' ? images(current.images) : images,
                }))
              }
            />

            <TagInput tags={form.tags} onChange={(tags) => update('tags', tags)} />
          </div>
          <div className="mt-4 flex items-center gap-2 pb-1">
            <button
              type="submit"
              className="h-8 w-[72px] rounded-md bg-primary text-[12px] font-medium text-white hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E] focus-visible:ring-offset-1"
            >
              Save
            </button>
            <button
              type="button"
              onClick={close}
              className="h-8 w-[72px] rounded-md border border-[#E5E5E5] bg-white text-[12px] text-[#444] hover:bg-[#F8F8F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E] focus-visible:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
