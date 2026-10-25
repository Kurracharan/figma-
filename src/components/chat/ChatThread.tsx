import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import type { Message } from '../../types/chat'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface ChatThreadProps {
  teamName?: string
  teamInitial?: string
  messages: Message[]
  onSendMessage: (text: string, file?: File) => void
  onOpenInviteModal: () => void
  inviteButtonRef: React.RefObject<HTMLButtonElement | null>
  onDownloadFile?: (fileName: string) => void
  onDeleteMessage?: (id: string) => void
}

export default function ChatThread({
  teamName = '#Designers',
  teamInitial = 'D',
  messages,
  onSendMessage,
  onOpenInviteModal,
  inviteButtonRef,
  onDownloadFile,
  onDeleteMessage,
}: ChatThreadProps) {
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <section
      className="flex min-w-0 flex-1 flex-col bg-white overflow-hidden"
      aria-label={`${teamName} chat thread`}
    >
      {/* Thread Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#EDEDED] bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Teal avatar "D" */}
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-chat-teal-avatar text-[13px] font-semibold text-chat-teal-text shadow-2xs">
            {teamInitial}
          </span>
          <h1 className="truncate text-[14px] font-semibold text-[#222222]">
            {teamName}
          </h1>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* "+" button opens Invite New Members modal */}
          <button
            ref={inviteButtonRef}
            type="button"
            onClick={onOpenInviteModal}
            aria-label="Invite new members"
            title="Invite new members"
            className="grid h-8 w-8 place-items-center rounded-lg border border-[#E5E5E5] text-[#555] transition-all hover:border-chat-primary hover:bg-chat-teal-bg/40 hover:text-chat-primary active:scale-95"
          >
            <Plus size={16} strokeWidth={2.2} />
          </button>

          {/* "…" icon button for more options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              aria-label="Thread options"
              title="More thread options"
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#E5E5E5] text-[#555] transition-all hover:bg-gray-50 hover:text-[#222]"
            >
              <MoreHorizontal size={16} strokeWidth={2} />
            </button>

            {headerMenuOpen && (
              <div className="absolute right-0 top-10 z-20 flex w-36 flex-col rounded-xl border border-[#EDEDED] bg-white py-1.5 shadow-lg text-[11px] text-[#444]">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(window.location.href)
                    setHeaderMenuOpen(false)
                  }}
                  className="px-3 py-1.5 text-left hover:bg-[#F5F5F5]"
                >
                  Copy chat link
                </button>
                <button
                  type="button"
                  onClick={() => setHeaderMenuOpen(false)}
                  className="px-3 py-1.5 text-left hover:bg-[#F5F5F5]"
                >
                  Mute alerts
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onDownloadFile={onDownloadFile}
            onDeleteMessage={onDeleteMessage}
          />
        ))}
      </div>

      {/* Input Bar */}
      <MessageInput onSendMessage={onSendMessage} />
    </section>
  )
}

