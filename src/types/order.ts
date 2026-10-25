export type OrderPayment = 'PayPal' | 'Credit Card' | 'Payoneer'
export type OrderStatus = 'Shipped' | 'Processing' | 'Cancelled' | 'Pending' | 'Refunded'
export type FulfilmentStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered'
export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded'

export interface Address {
  firstName: string
  lastName: string
  address: string
  state: string
  city: string
  country: string
  phone: string
  email: string
  postcode: string
}

export interface OrderCustomerDetails {
  name: string
  email: string
  phone: string
  location: string
  avatarUrl?: string
}

export interface OrderPaymentDetails {
  method: OrderPayment
  transactionId: string
  amount: number
}

export interface OrderShippingDetails {
  method: 'Carrier' | 'Pickup' | 'Express'
  trackingCode: string
  date: string
}

export interface OrderItem {
  name: string
  qty: number
  price: number
}

export interface Order {
  id: string
  orderNo: string
  customer: string
  date: string
  total: number
  payment: OrderPayment
  status: OrderStatus
  customerDetails?: OrderCustomerDetails
  paymentDetails?: OrderPaymentDetails
  shipping?: OrderShippingDetails
  fulfilmentStatus?: FulfilmentStatus
  paymentStatus?: PaymentStatus
  billingAddress?: Address
  shippingAddress?: Address
  items?: OrderItem[]
}
