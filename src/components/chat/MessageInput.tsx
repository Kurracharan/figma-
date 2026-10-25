import { useRef, useState } from 'react'
import { FileText, Paperclip, Send, Smile, X } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (text: string, file?: File) => void
}

const quickEmojis = ['😀', '😊', '😍', '👍', '🎉', '❤️', '🙌', '✨', '🚀', '💡', '🔥', '👏']

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() && !attachedFile) return

    onSendMessage(text.trim(), attachedFile ?? undefined)
    setText('')
    setAttachedFile(null)
    setEmojiOpen(false)
  }

  function handleAddEmoji(emoji: string) {
    setText((prev) => `${prev}${emoji}`)
    textInputRef.current?.focus()
  }

  return (
    <div className="relative border-t border-[#EDEDED] bg-white p-3 sm:p-4">
      {/* File attachment preview if selected */}
      {attachedFile && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-[11px] text-[#444]">
          <FileText size={14} className="text-chat-primary" />
          <span className="truncate max-w-[200px]">{attachedFile.name}</span>
          <span className="text-[10px] text-[#888]">
            ({Math.max(1, Math.round(attachedFile.size / 1024))} KB)
          </span>
          <button
            type="button"
            onClick={() => setAttachedFile(null)}
            className="ml-auto text-[#888] hover:text-[#333]"
            aria-label="Remove attached file"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {emojiOpen && (
        <div
          className="absolute bottom-full left-4 mb-2 z-30 flex flex-wrap gap-1 rounded-xl border border-[#EDEDED] bg-white p-2 shadow-lg max-w-[220px]"
          role="group"
          aria-label="Choose emoji"
        >
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="grid h-8 w-8 place-items-center rounded-lg text-[16px] hover:bg-chat-teal-bg/60 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Form Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 focus-within:border-chat-primary focus-within:ring-1 focus-within:ring-chat-primary/20 transition-all"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0]
            if (file) setAttachedFile(file)
            e.currentTarget.value = ''
          }}
          aria-label="Upload file"
        />

        {/* Paperclip button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="grid h-8 w-8 place-items-center rounded-lg text-[#8A8A8A] transition-colors hover:bg-[#F5F5F5] hover:text-chat-primary"
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip size={18} strokeWidth={1.8} />
        </button>

        {/* Emoji button */}
        <button
          type="button"
          onClick={() => setEmojiOpen(!emojiOpen)}
          className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-[#F5F5F5] ${
            emojiOpen
              ? 'text-chat-primary bg-chat-teal-bg/50'
              : 'text-[#8A8A8A] hover:text-chat-primary'
          }`}
          title="Insert emoji"
          aria-label="Insert emoji"
        >
          <Smile size={18} strokeWidth={1.8} />
        </button>

        {/* Text Input */}
        <input
          ref={textInputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message here..."
          className="flex-1 bg-transparent px-1 py-1 text-[12px] text-[#222222] outline-none placeholder:text-[#A0A0A0]"
          aria-label="Message text"
        />

        {/* Circular green send button with paper-plane icon */}
        <button
          type="submit"
          disabled={!text.trim() && !attachedFile}
          aria-label="Send message"
          title="Send message"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-chat-primary text-white shadow-xs transition-all hover:bg-chat-primary-hover active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Send size={15} strokeWidth={2} className="ml-0.5" />
        </button>
      </form>
    </div>
  )
}

