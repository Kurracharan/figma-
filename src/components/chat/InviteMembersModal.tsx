import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import type { Member } from '../../types/chat'

interface InviteMembersModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (selectedMemberIds: string[]) => void
  allMembers: Member[]
  initiallySelectedIds?: string[]
  teamName?: string
  triggerRef?: React.RefObject<HTMLElement | null>
}

export default function InviteMembersModal({
  isOpen,
  onClose,
  onInvite,
  allMembers,
  initiallySelectedIds = [],
  teamName = 'Designers',
  triggerRef,
}: InviteMembersModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initiallySelectedIds)
  const [searchTerm, setSearchTerm] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Return focus on close
  useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus()
    }
  }, [isOpen, triggerRef])

  // Close on Escape & Focus Trap
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Filtered members by search
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return allMembers
    const q = searchTerm.toLowerCase()
    return allMembers.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    )
  }, [allMembers, searchTerm])

  const selectedMembers = useMemo(() => {
    return allMembers.filter((m) => selectedIds.includes(m.id))
  }, [allMembers, selectedIds])

  function toggleMember(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function removeChip(id: string) {
    setSelectedIds((prev) => prev.filter((item) => item !== id))
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && filteredMembers.length > 0) {
      e.preventDefault()
      const first = filteredMembers[0]
      if (first) {
        toggleMember(first.id)
        setSearchTerm('')
      }
    } else if (e.key === 'Backspace' && !searchTerm && selectedIds.length > 0) {
      e.preventDefault()
      const lastId = selectedIds[selectedIds.length - 1]
      removeChip(lastId)
    }
  }

  function handleInviteSubmit() {
    onInvite(selectedIds)
    onClose()
  }

  if (!isOpen) return null

  // Clean team display name (remove leading # if present)
  const cleanTeamName = teamName.replace(/^#/, '')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="presentation"
    >
      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-[360px] flex-col rounded-2xl bg-white p-5 shadow-2xl border border-[#EDEDED] animate-in zoom-in-95 duration-150"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-1">
          <h2
            id={titleId}
            className="text-[20px] font-semibold text-[#222222] tracking-tight"
          >
            Invite New Members
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-7 w-7 place-items-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        {/* Team Subtitle Label */}
        <p className="mt-1 text-[12px] text-[#666666]">
          Invite Members to <strong className="font-bold text-[#222222]">{cleanTeamName}</strong>{' '}
          Team
        </p>

        {/* Search Field with Chips */}
        <div className="mt-3 flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-2.5 py-1.5 focus-within:border-chat-primary focus-within:ring-1 focus-within:ring-chat-primary/20 transition-all">
          {/* Selected Chips */}
          {selectedMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-0.5 pl-1 pr-2 text-[11px] font-medium text-[#333333] transition-colors hover:bg-gray-200"
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full text-[8px] font-semibold text-[#3E3B37]"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.initials}
              </span>
              <span>{member.name}</span>
              <button
                type="button"
                onClick={() => removeChip(member.id)}
                className="grid h-3.5 w-3.5 place-items-center rounded-full text-gray-400 hover:bg-gray-300 hover:text-gray-700"
                aria-label={`Remove ${member.name}`}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}

          {/* Input Area */}
          <div className="flex flex-1 items-center min-w-[70px]">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={selectedMembers.length === 0 ? 'Search members...' : ''}
              className="w-full bg-transparent text-[11px] text-[#222] outline-none placeholder:text-[#9E9E9E]"
              aria-label="Filter members to invite"
            />
          </div>

          <Search size={14} className="shrink-0 text-[#9E9E9E]" />
        </div>

        {/* Dynamic Invited Count Label */}
        <div className="mt-3.5">
          <p className="text-[12px] font-semibold text-[#222222]">
            Invited({selectedIds.length})
          </p>
        </div>

        {/* Scrollable List of Pill-shaped Member Rows */}
        <div className="mt-2 max-h-[220px] overflow-y-auto space-y-1.5 pr-0.5">
          {filteredMembers.map((member) => {
            const isChecked = selectedIds.includes(member.id)

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => toggleMember(member.id)}
                className={`group flex w-full items-center justify-between rounded-full border px-3 py-1.5 text-left transition-all ${
                  isChecked
                    ? 'border-emerald-300 bg-emerald-50/50 text-[#1F8A3B]'
                    : 'border-[#EAEAEA] bg-white text-[#333333] hover:border-gray-300 hover:bg-gray-50'
                }`}
                aria-pressed={isChecked}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold text-[#3E3B37]"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.initials}
                  </span>
                  <span className="truncate text-[12px] font-medium text-[#222222]">
                    {member.name}
                  </span>
                </div>

                {/* Green check icon on the right */}
                {isChecked ? (
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-chat-primary">
                    <Check size={16} strokeWidth={2.4} />
                  </span>
                ) : (
                  <span className="h-5 w-5 shrink-0 rounded-full border border-gray-200 group-hover:border-gray-400" />
                )}
              </button>
            )
          })}

          {filteredMembers.length === 0 && (
            <p className="py-4 text-center text-[11px] text-[#8A8A8A]">
              No matching people found.
            </p>
          )}
        </div>

        {/* Bottom Actions: Green Invite Button at bottom-left */}
        <div className="mt-4 flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleInviteSubmit}
            className="rounded-xl bg-chat-primary px-6 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-chat-primary-hover active:scale-95"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  )
}

