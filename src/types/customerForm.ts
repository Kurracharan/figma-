export interface AddressFields {
  line1: string
  line2?: string
  city: string
  country: string
  state: string
  postcode: string
}

export interface NewCustomerForm {
  name: string
  email: string
  phone: string
  status: 'Active' | 'Blocked'
  address: AddressFields
  paymentMethod: 'Credit Card' | 'PayPal'
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
}
