import { useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import type { Conversation, Member } from '../../types/chat'

interface ConversationListProps {
  conversations: Conversation[]
  people: Member[]
  selectedId: string
  onSelectConversation: (id: string, type?: 'team' | 'person') => void
  onAddTeamClick?: () => void
  onAddPersonClick?: () => void
}

export default function ConversationList({
  conversations,
  people,
  selectedId,
  onSelectConversation,
  onAddTeamClick,
  onAddPersonClick,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const q = searchQuery.toLowerCase()
    return conversations.filter(
      (c) => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    )
  }, [conversations, searchQuery])

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people
    const q = searchQuery.toLowerCase()
    return people.filter(
      (p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
    )
  }, [people, searchQuery])

  return (
    <aside
      className="flex w-full sm:w-[250px] shrink-0 flex-col border-r border-[#EDEDED] bg-white overflow-hidden"
      aria-label="Teams and conversations"
    >
      {/* Search Input */}
      <div className="p-3 pb-2">
        <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#EAEAEA] bg-[#F7F7F7] px-3 focus-within:border-chat-primary focus-within:bg-white focus-within:ring-1 focus-within:ring-chat-primary/20 transition-all">
          <Search size={14} className="shrink-0 text-[#9E9E9E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-[11px] text-[#222] outline-none placeholder:text-[#9E9E9E]"
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#9E9E9E] hover:text-[#555]"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable list of Teams and People */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {/* TEAMS Section */}
        <section className="mb-4">
          <div className="flex h-7 items-center justify-between px-2 text-[10px] font-semibold tracking-wider text-[#8A8A8A]">
            <span>TEAMS</span>
            <button
              type="button"
              onClick={onAddTeamClick}
              title="Add team"
              aria-label="Add team"
              className="grid h-5 w-5 place-items-center rounded-md text-[#8A8A8A] transition-colors hover:bg-[#F2F2F2] hover:text-chat-primary"
            >
              <Plus size={13} strokeWidth={2.2} />
            </button>
          </div>

          <div className="space-y-1">
            {filteredTeams.map((team) => {
              const isSelected = selectedId === team.id
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => onSelectConversation(team.id, 'team')}
                  className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all ${
                    isSelected
                      ? 'bg-chat-teal-bg/70 text-[#1F8A3B] shadow-2xs'
                      : 'hover:bg-[#F7F7F7] text-[#333]'
                  }`}
                >
                  {/* Teal Avatar */}
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-chat-teal-avatar text-[13px] font-semibold text-chat-teal-text">
                    {team.initial}
                  </span>

                  {/* Name and Preview */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[12px] font-semibold text-[#222222]">
                        {team.name}
                      </span>
                    </div>
                    <p className="truncate text-[10px] text-[#8A8A8A]">
                      {team.preview}
                    </p>
                  </div>

                  {/* Red Unread Badge */}
                  {team.unreadCount && team.unreadCount > 0 ? (
                    <span className="grid h-[18px] min-w-[18px] shrink-0 place-items-center rounded-full bg-chat-badge-red px-1 text-[10px] font-bold text-white shadow-2xs">
                      {team.unreadCount}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        {/* PEOPLE Section */}
        <section>
          <div className="flex h-7 items-center justify-between border-t border-[#F0F0F0] pt-2 px-2 text-[10px] font-semibold tracking-wider text-[#8A8A8A]">
            <span>PEOPLE</span>
            <button
              type="button"
              onClick={onAddPersonClick}
              title="Add person"
              aria-label="Add person"
              className="grid h-5 w-5 place-items-center rounded-md text-[#8A8A8A] transition-colors hover:bg-[#F2F2F2] hover:text-chat-primary"
            >
              <Plus size={13} strokeWidth={2.2} />
            </button>
          </div>

          <div className="space-y-1">
            {filteredPeople.map((person) => {
              const isSelected = selectedId === person.id
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => onSelectConversation(person.id, 'person')}
                  className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition-all ${
                    isSelected
                      ? 'bg-chat-teal-bg/60 text-[#1F8A3B]'
                      : 'hover:bg-[#F7F7F7] text-[#333]'
                  }`}
                >
                  {/* Person Avatar with optional online dot */}
                  <span
                    className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-[#3E3B37]"
                    style={{ backgroundColor: person.avatarColor }}
                  >
                    {person.initials}
                    {person.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </span>

                  {/* Name and role */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-[#222222]">
                      {person.name}
                    </p>
                    <p className="truncate text-[9.5px] text-[#8A8A8A]">
                      {person.role}
                    </p>
                  </div>

                  {/* Unread badge if any */}
                  {person.unreadBadge && person.unreadBadge > 0 ? (
                    <span className="grid h-[16px] min-w-[16px] shrink-0 place-items-center rounded-full bg-chat-badge-red px-1 text-[9px] font-bold text-white shadow-2xs">
                      {person.unreadBadge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </aside>
  )
}
