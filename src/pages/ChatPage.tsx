import { useRef, useState } from 'react'
import ConversationList from '../components/chat/ConversationList'
import ChatThread from '../components/chat/ChatThread'
import GroupInfoPanel from '../components/chat/GroupInfoPanel'
import IconSidebar from '../components/chat/IconSidebar'
import InviteMembersModal from '../components/chat/InviteMembersModal'
import TopBar from '../components/chat/TopBar'
import Sidebar from '../components/Sidebar'
import {
  initialConversations,
  initialFiles,
  initialMessages,
  initialPeople,
  initialPhotos,
  initialTeamMembers,
} from '../data/chat'
import type { Conversation, Member, Message } from '../types/chat'

export default function ChatPage() {
  const [conversations] = useState<Conversation[]>(initialConversations)
  const [people] = useState<Member[]>(initialPeople)
  const [selectedId, setSelectedId] = useState<string>('designers')

  // Chat messages per conversation
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  // Team members count (dynamic, updated by invite modal)
  const [membersCount, setMembersCount] = useState<number>(8)
  const [teamMembers, setTeamMembers] = useState<Member[]>(initialTeamMembers)

  // Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const inviteButtonRef = useRef<HTMLButtonElement | null>(null)

  // Mobile / responsive sidebar states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showRightPanelMobile, setShowRightPanelMobile] = useState(false)
  const [showConversationListMobile, setShowConversationListMobile] = useState(false)

  // Get active conversation name
  const currentTeam = conversations.find((c) => c.id === selectedId)
  const currentPerson = people.find((p) => p.id === selectedId)
  const activeTitle = currentTeam?.name ?? currentPerson?.name ?? '#Designers'
  const activeInitial = currentTeam?.initial ?? currentPerson?.initials.charAt(0) ?? 'D'

  // Initially selected members for the invite modal (6 members)
  const initiallySelectedMemberIds = people
    .filter((p) => p.invited)
    .map((p) => p.id)

  function handleSelectConversation(id: string) {
    setSelectedId(id)
    setShowConversationListMobile(false)
  }

  function handleSendMessage(text: string, file?: File) {
    if (!text && !file) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'art-template',
      senderName: 'ArtTemplate',
      senderInitials: 'AT',
      senderColor: '#1F8A3B',
      timestamp: 'Just now',
      isSent: true,
      kind: file ? 'file' : 'text',
      text: text || undefined,
      file: file
        ? {
            name: file.name,
            size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
          }
        : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  function handleDownloadFile(fileName: string) {
    const pdfContent =
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 64 >>\nstream\nBT /F1 16 Tf 40 100 Td (Brand Styles Guide - Figma Dashboard Preview) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000244 00000 n \n0000000358 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n435\n%%EOF'

    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleDeleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  function handleInviteMembers(selectedIds: string[]) {
    // Update dynamic count
    setMembersCount(selectedIds.length)

    // Update member list in right panel to reflect selected members
    const updatedMembers = people.filter((p) => selectedIds.includes(p.id))
    setTeamMembers(updatedMembers)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans text-[#222222]">
      {/* Drawer menu for mobile navigation */}
      {isMobileMenuOpen && (
        <Sidebar isOpen onClose={() => setIsMobileMenuOpen(false)} />
      )}

      {/* 1. Left Icon Rail (~56px, full height) */}
      <IconSidebar activeItem="chat" />

      {/* Right Content Area (TopBar + 3 columns) */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 2. Top bar across the remaining width */}
        <TopBar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          userName="ArtTemplate"
        />

        {/* 3 Columns Layout (Conversation List + Chat Thread + Group Info Panel) */}
        <div className="relative flex flex-1 min-h-0 overflow-hidden bg-white">
          {/* Mobile toggle controls for responsive view */}
          <div className="lg:hidden absolute top-2 right-2 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => setShowConversationListMobile(!showConversationListMobile)}
              className="rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[11px] font-medium shadow-2xs text-[#444] hover:bg-gray-50"
            >
              {showConversationListMobile ? 'Hide Chats' : 'Chats'}
            </button>
            <button
              type="button"
              onClick={() => setShowRightPanelMobile(!showRightPanelMobile)}
              className="xl:hidden rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[11px] font-medium shadow-2xs text-[#444] hover:bg-gray-50"
            >
              {showRightPanelMobile ? 'Hide Info' : 'Info'}
            </button>
          </div>

          {/* 3. Conversation list (~250px, collapse below ~1024px) */}
          <div
            className={`transition-all duration-200 ${
              showConversationListMobile
                ? 'absolute inset-y-0 left-0 z-20 flex w-[260px] shadow-xl'
                : 'hidden lg:flex'
            }`}
          >
            <ConversationList
              conversations={conversations}
              people={people}
              selectedId={selectedId}
              onSelectConversation={handleSelectConversation}
              onAddTeamClick={() => setIsInviteModalOpen(true)}
              onAddPersonClick={() => setIsInviteModalOpen(true)}
            />
          </div>

          {/* 4. Chat thread (flex-1) */}
          <ChatThread
            teamName={activeTitle}
            teamInitial={activeInitial}
            messages={messages}
            onSendMessage={handleSendMessage}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            inviteButtonRef={inviteButtonRef}
            onDownloadFile={handleDownloadFile}
            onDeleteMessage={handleDeleteMessage}
          />

          {/* 5. Right info panel (~250px, collapse below ~1280px) */}
          <div
            className={`transition-all duration-200 ${
              showRightPanelMobile
                ? 'absolute inset-y-0 right-0 z-20 flex w-[260px] shadow-xl'
                : 'hidden xl:flex'
            }`}
          >
            <GroupInfoPanel
              teamName={activeTitle}
              teamInitial={activeInitial}
              membersCount={membersCount}
              files={initialFiles}
              photos={initialPhotos}
              members={teamMembers}
              onDownloadFile={handleDownloadFile}
              onMemberClick={(m) => handleSelectConversation(m.id)}
            />
          </div>
        </div>
      </div>

      {/* Invite New Members Modal */}
      <InviteMembersModal
        key={isInviteModalOpen ? 'modal-open' : 'modal-closed'}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMembers}
        allMembers={people}
        initiallySelectedIds={initiallySelectedMemberIds}
        teamName={activeTitle}
        triggerRef={inviteButtonRef}
      />
    </div>
  )
}
