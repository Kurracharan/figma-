import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [value, setValue] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !tags.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed])
    }
    setValue('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(value)
    } else if (event.key === 'Backspace' && !value && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div>
      <label htmlFor="product-tags" className="mb-1.5 block text-[10px] text-muted">Tags</label>
      <div className="flex min-h-8 flex-wrap items-center gap-1.5 rounded-full border border-[#E5E5E5] px-2 py-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-[#B9EE8E]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-5 items-center gap-1 rounded-[5px] bg-[#F0F0F0] px-1.5 text-[10px] text-[#444]"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag} tag`}
              onClick={() => onChange(tags.filter((item) => item !== tag))}
              className="grid place-items-center text-[#858585] hover:text-ink"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          id="product-tags"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => value.trim() && addTag(value)}
          className="h-5 min-w-12 flex-1 border-0 bg-transparent p-0 text-[11px] text-ink outline-none focus:ring-0"
        />
      </div>
    </div>
  )
}
