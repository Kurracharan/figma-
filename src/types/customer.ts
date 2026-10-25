export type CustomerStatus = 'Active' | 'Blocked'

export interface Customer {
  id: string
  name: string
  email: string
  avatarUrl: string
  location: string
  phone: string
  date: string
  status: CustomerStatus
}
