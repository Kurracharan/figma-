import { useState } from 'react'
import { ArrowDownToLine, Copy, FileText, MoreHorizontal, Trash2 } from 'lucide-react'
import type { Message } from '../../types/chat'

interface MessageBubbleProps {
  message: Message
  onDownloadFile?: (fileName: string) => void
  onDeleteMessage?: (id: string) => void
}

export default function MessageBubble({
  message,
  onDownloadFile,
  onDeleteMessage,
}: MessageBubbleProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isSent = message.isSent

  function handleCopy() {
    if (message.text) {
      void navigator.clipboard?.writeText(message.text)
    }
    setMenuOpen(false)
  }

  function handleDelete() {
    onDeleteMessage?.(message.id)
    setMenuOpen(false)
  }

  return (
    <div
      className={`group relative flex w-full gap-2.5 ${
        isSent ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Received Avatar (Left) */}
      {!isSent && (
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-[#3E3B37]"
          style={{ backgroundColor: message.senderColor }}
          title={message.senderName}
        >
          {message.senderInitials}
        </span>
      )}

      {/* Bubble + Timestamp column */}
      <div
        className={`flex max-w-[82%] sm:max-w-[460px] flex-col ${
          isSent ? 'items-end' : 'items-start'
        }`}
      >
        <div className="relative flex items-center gap-1.5">
          {/* Menu button beside SENT bubble (left of sent bubble) */}
          {isSent && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="grid h-6 w-6 place-items-center rounded-md text-[#999] opacity-0 transition-opacity hover:bg-gray-100 hover:text-[#444] group-hover:opacity-100"
                aria-label="Message options"
              >
                <MoreHorizontal size={14} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-7 z-20 flex w-28 flex-col rounded-lg border border-[#E5E5E5] bg-white py-1 shadow-lg text-[11px] text-[#444]">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#F5F5F5]"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-1.5 text-left text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Actual Bubble Content */}
          {message.kind === 'gallery' ? (
            <div className="rounded-2xl rounded-tl-xs border border-[#E5E5E5] bg-white p-3 shadow-2xs">
              {message.text && (
                <p className="mb-2 text-[12px] leading-relaxed text-[#222222]">
                  {message.text}
                </p>
              )}
              {/* Image attachment row: thumbnails plus a "+3" tile */}
              <div className="flex flex-wrap items-center gap-2">
                {message.gallery?.images.map((img) => (
                  <div
                    key={img.id}
                    className="flex h-14 w-18 flex-col overflow-hidden rounded-lg border border-black/5 shadow-2xs transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: img.bg }}
                  >
                    <div className="h-2.5 w-full" style={{ backgroundColor: img.accent }} />
                    <div className="flex flex-1 flex-col gap-1 p-1.5">
                      <div className="h-1.5 w-6 rounded-full bg-white/60" />
                      <div className="flex-1 rounded-sm bg-white/40" />
                    </div>
                  </div>
                ))}
                {Boolean(message.gallery?.extraCount && message.gallery.extraCount > 0) && (
                  <button
                    type="button"
                    className="grid h-14 w-12 place-items-center rounded-lg border border-[#E0E0E0] bg-[#F2F2F2] text-[12px] font-bold text-[#666] transition-colors hover:bg-[#E8E8E8] hover:text-chat-primary"
                    aria-label={`View ${message.gallery?.extraCount} more images`}
                  >
                    +{message.gallery?.extraCount}
                  </button>
                )}
              </div>
            </div>
          ) : message.kind === 'file' ? (
            <div className="flex items-center gap-3 rounded-2xl rounded-tl-xs border border-[#E5E5E5] bg-white p-2.5 shadow-2xs">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
                <FileText size={18} />
              </span>
              <div className="min-w-0 pr-2">
                <p className="truncate text-[12px] font-semibold text-[#222222]">
                  {message.file?.name}
                </p>
                <p className="text-[10px] text-[#8A8A8A]">{message.file?.size}</p>
              </div>
              <button
                type="button"
                onClick={() => onDownloadFile?.(message.file?.name ?? 'file.pdf')}
                className="flex items-center gap-1.5 rounded-lg bg-chat-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-chat-primary-hover active:scale-95"
              >
                <span>Download</span>
                <ArrowDownToLine size={13} />
              </button>
            </div>
          ) : (
            <div
              className={`rounded-2xl px-4 py-2.5 text-[12px] leading-relaxed shadow-2xs ${
                isSent
                  ? 'rounded-tr-xs bg-chat-primary text-white'
                  : 'rounded-tl-xs border border-[#E5E5E5] bg-white text-[#222222]'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          )}

          {/* Menu button beside RECEIVED bubble (right of received bubble) */}
          {!isSent && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="grid h-6 w-6 place-items-center rounded-md text-[#999] opacity-0 transition-opacity hover:bg-gray-100 hover:text-[#444] group-hover:opacity-100"
                aria-label="Message options"
              >
                <MoreHorizontal size={14} />
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-7 z-20 flex w-28 flex-col rounded-lg border border-[#E5E5E5] bg-white py-1 shadow-lg text-[11px] text-[#444]">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#F5F5F5]"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-1.5 text-left text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamps in muted gray under the bubbles */}
        <span className="mt-1 px-1 text-[10px] text-[#999999]">
          {message.timestamp}
        </span>
      </div>

      {/* Sent Avatar (Right) */}
      {isSent && (
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white shadow-2xs"
          style={{ backgroundColor: message.senderColor }}
          title={message.senderName}
        >
          {message.senderInitials}
        </span>
      )}
    </div>
  )
}

