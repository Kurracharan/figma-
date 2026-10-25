import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Check, ChevronDown, X } from 'lucide-react'
import type { Customer } from '../types/customer'

interface AddCustomerModalProps {
  open: boolean
  onClose: () => void
  onAddCustomer?: (customer: Partial<Customer>) => void
}

type AddCustomerTab = 'PROFILE' | 'ADDRESS' | 'PAYMENT' | 'SUBMISSION'

const tabs: AddCustomerTab[] = ['PROFILE', 'ADDRESS', 'PAYMENT', 'SUBMISSION']

export default function AddCustomerModal({
  open,
  onClose,
  onAddCustomer,
}: AddCustomerModalProps) {
  const [activeTab, setActiveTab] = useState<AddCustomerTab>('PROFILE')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Customer['status']>('Active')
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal'>('Credit Card')
  const [cardNumber, setCardNumber] = useState('5890 - 6858 - 6332 - 9843')
  const [cardHolder, setCardHolder] = useState('Regina Cooper')
  const [expiryMonth, setExpiryMonth] = useState('12')
  const [expiryYear, setExpiryYear] = useState('2023')

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeModal = useCallback(() => {
    setActiveTab('PROFILE')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }, [open, closeModal])

  if (!open) return null

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (activeTab === 'PROFILE') {
      setActiveTab('ADDRESS')
    } else {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'New Customer'
      onAddCustomer?.({
        name: fullName,
        email: email || 'customer@example.com',
        phone: `${countryCode} ${phone}`.trim(),
        status,
        location: 'United States',
        date: new Date().toLocaleDateString('en-GB').replaceAll('/', '.'),
      })
      closeModal()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[130] flex justify-center overflow-y-auto bg-black/40 px-3 pt-[70px] transition-opacity duration-150 sm:px-4 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-customer-title"
        className={`relative mb-8 h-fit max-h-[90vh] w-[660px] max-w-full overflow-y-auto rounded-lg bg-white shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-transform duration-150 ease-out ${
          open ? 'scale-100' : 'scale-[0.98]'
        }`}
      >
        {/* Header Tabs Row */}
        <div className="flex items-center justify-between border-b border-[#EDEDED] px-5 sm:px-6">
          <div role="tablist" aria-label="Customer steps" className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`customer-tab-${tab.toLowerCase()}`}
                aria-selected={activeTab === tab}
                aria-controls={`customer-panel-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`h-12 border-b-2 px-0.5 pt-1 text-[11px] font-medium uppercase tracking-[0.03em] transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#333] hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            onClick={closeModal}
            className="grid h-6 w-6 place-items-center rounded-md bg-[#F3F3F3] text-[#333] hover:bg-[#E8E8E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
          >
            <X size={12} />
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'PROFILE' && (
          <div
            role="tabpanel"
            id="customer-panel-profile"
            aria-labelledby="customer-tab-profile"
            className="p-5 sm:p-6"
          >
            <h2 id="add-customer-title" className="m-0 mb-5 text-[20px] font-medium text-[#222]">
              Profile
            </h2>

            {/* Profile Avatar / Photo Control Area (No profile photo image as per reference) */}
            <div className="mb-6 flex items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F3F3] border border-[#E5E5E5] text-[#9A9A9A]">
                <Camera size={26} strokeWidth={1.5} />
                <button
                  type="button"
                  aria-label="Upload photo"
                  className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-white shadow-sm hover:bg-[#187926]"
                >
                  <Camera size={12} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="mb-1.5 block text-[11px] font-medium text-[#333]">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="h-9 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-[11px] text-[#222] outline-none placeholder:text-[#A0A0A0] focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-1.5 block text-[11px] font-medium text-[#333]">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="h-9 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-[11px] text-[#222] outline-none placeholder:text-[#A0A0A0] focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email (Full width) */}
              <div>
                <label htmlFor="customer-email" className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="h-9 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-[11px] text-[#222] outline-none placeholder:text-[#A0A0A0] focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Phone (Country Code + Number) */}
              <div>
                <label htmlFor="customer-phone" className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Phone
                </label>
                <div className="flex gap-2">
                  <div className="relative w-[110px] shrink-0">
                    <select
                      aria-label="Country Code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-9 w-full appearance-none rounded-md border border-[#E5E5E5] bg-white pl-3 pr-7 text-[11px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+49">+49 (DE)</option>
                      <option value="+33">+33 (FR)</option>
                      <option value="+61">+61 (AU)</option>
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                  </div>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(070) 123–4567"
                    className="h-9 min-w-0 flex-1 rounded-md border border-[#E5E5E5] bg-white px-3 text-[11px] text-[#222] outline-none placeholder:text-[#A0A0A0] focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label htmlFor="customer-status" className="mb-1.5 block text-[11px] font-medium text-[#333]">
                  Status
                </label>
                <div className="relative w-full">
                  <select
                    id="customer-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Customer['status'])}
                    className="h-9 w-full appearance-none rounded-md border border-[#E5E5E5] bg-white pl-3 pr-7 text-[11px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                </div>
              </div>

              {/* Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="h-9 rounded-md bg-primary px-6 text-[11px] font-medium text-white hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'PAYMENT' && (
          <div
            role="tabpanel"
            id="customer-panel-payment"
            aria-labelledby="customer-tab-payment"
            className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6"
          >
            <h2 id="add-customer-title" className="m-0 mb-5 text-[20px] font-medium text-[#222]">
              Payment
            </h2>

            <div className="mb-5">
              <p className="mb-2.5 mt-0 text-[12px] font-medium text-[#333]">
                Choose payment method:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(['Credit Card', 'PayPal'] as const).map((method) => {
                  const selected = paymentMethod === method
                  return (
                    <button
                      key={method}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex h-10 min-w-0 items-center gap-2.5 rounded-md border px-3 text-left text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E] ${
                        selected
                          ? 'border-primary bg-white text-[#222]'
                          : 'border-[#E5E5E5] bg-[#F8F8F8] text-[#777]'
                      }`}
                    >
                      <span className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[3px] border ${
                        selected ? 'border-primary bg-primary text-white' : 'border-[#D7D7D7] bg-white'
                      }`}>
                        {selected && <Check size={11} strokeWidth={2.5} />}
                      </span>
                      <span className="truncate">{method}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="payment-card-number" className="mb-[6px] block text-[11px] font-normal text-[#8A8A8A]">
                Card Number
              </label>
              <div className="relative">
                <input
                  id="payment-card-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  className="h-9 w-full rounded-md border border-[#E5E5E5] bg-white px-3 pr-[82px] text-[12px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2" aria-label="Visa and Mastercard">
                  <span className="text-[11px] font-semibold italic tracking-[-0.06em] text-[#1A1F71]">VISA</span>
                  <span className="relative flex h-3 w-5 items-center">
                    <span className="absolute left-0 h-3 w-3 rounded-full bg-[#EB001B]" />
                    <span className="absolute right-0 h-3 w-3 rounded-full bg-[#F79E1B] mix-blend-multiply" />
                  </span>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="payment-card-holder" className="mb-[6px] block text-[11px] font-normal text-[#8A8A8A]">
                Card Holder
              </label>
              <input
                id="payment-card-holder"
                type="text"
                autoComplete="cc-name"
                value={cardHolder}
                onChange={(event) => setCardHolder(event.target.value)}
                className="h-9 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-[12px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="payment-expiry-month" className="mb-[6px] block text-[11px] font-normal text-[#8A8A8A]">
                  Month
                </label>
                <div className="relative">
                  <select
                    id="payment-expiry-month"
                    autoComplete="cc-exp-month"
                    value={expiryMonth}
                    onChange={(event) => setExpiryMonth(event.target.value)}
                    className="h-9 w-full cursor-pointer appearance-none rounded-md border border-[#E5E5E5] bg-white pl-3 pr-8 text-[12px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                </div>
              </div>
              <div>
                <label htmlFor="payment-expiry-year" className="mb-[6px] block text-[11px] font-normal text-[#8A8A8A]">
                  Year
                </label>
                <div className="relative">
                  <select
                    id="payment-expiry-year"
                    autoComplete="cc-exp-year"
                    value={expiryYear}
                    onChange={(event) => setExpiryYear(event.target.value)}
                    className="h-9 w-full cursor-pointer appearance-none rounded-md border border-[#E5E5E5] bg-white pl-3 pr-8 text-[12px] text-[#222] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {Array.from({ length: 8 }, (_, index) => String(2023 + index)).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('ADDRESS')}
                className="h-8 w-20 rounded-md border border-[#E5E5E5] bg-white text-[12px] font-medium text-[#333] hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SUBMISSION')}
                className="h-8 w-20 rounded-md bg-primary text-[12px] font-medium text-white hover:bg-[#187926] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Other Tabs (Address and Submission) */}
        {(activeTab === 'ADDRESS' || activeTab === 'SUBMISSION') && (
          <div className="p-5 text-center text-[12px] text-[#666] sm:p-6">
            <h2 className="m-0 mb-4 text-[18px] font-medium text-[#222]">{activeTab} Details</h2>
            <p className="mb-6 text-[11px] text-[#8A8A8A]">Configure {activeTab.toLowerCase()} information for customer.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.indexOf(activeTab)
                  if (idx > 0) setActiveTab(tabs[idx - 1])
                }}
                className="h-9 rounded-md border border-[#E5E5E5] bg-white px-4 text-[11px] text-[#444] hover:bg-[#F5F5F5]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.indexOf(activeTab)
                  if (idx < tabs.length - 1) {
                    setActiveTab(tabs[idx + 1])
                  } else {
                    closeModal()
                  }
                }}
                className="h-9 rounded-md bg-primary px-6 text-[11px] font-medium text-white hover:bg-[#187926]"
              >
                {activeTab === 'SUBMISSION' ? 'Save Customer' : 'Next Step'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
