export interface Member {
  id: string
  name: string
  role: string
  initials: string
  avatarColor: string
  online?: boolean
  unreadBadge?: number
  invited?: boolean
}

export interface Conversation {
  id: string
  name: string
  type: 'team' | 'person'
  initial: string
  avatarColor: string
  preview: string
  unreadCount?: number
  selected?: boolean
  membersCount?: number
}

export interface MessageAttachment {
  name: string
  size: string
  downloadUrl?: string
}

export interface MessageImageGallery {
  images: { id: string; label: string; bg: string; accent: string }[]
  extraCount?: number
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderInitials: string
  senderColor: string
  timestamp: string
  isSent: boolean
  text?: string
  kind?: 'text' | 'gallery' | 'file'
  gallery?: MessageImageGallery
  file?: MessageAttachment
}

export interface FileItem {
  id: string
  name: string
  size: string
  type: 'pdf' | 'psd' | 'fig' | 'zip'
}

export interface PhotoItem {
  id: string
  title: string
  bg: string
  accent: string
}

