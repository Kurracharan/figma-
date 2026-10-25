import { useRef } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  Underline,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const tools = [
  { label: 'Bold', command: 'bold', icon: Bold },
  { label: 'Italic', command: 'italic', icon: Italic },
  { label: 'Underline', command: 'underline', icon: Underline },
  { label: 'Align left', command: 'justifyleft', icon: AlignLeft },
  { label: 'Align center', command: 'justifycenter', icon: AlignCenter },
  { label: 'Align right', command: 'justifyright', icon: AlignRight },
  { label: 'Justify', command: 'justifyfull', icon: AlignJustify },
]

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  function runCommand(command: string, argument?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, argument)
    onChange(editorRef.current?.innerHTML ?? '')
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#E5E5E5] focus-within:border-primary focus-within:ring-1 focus-within:ring-[#B9EE8E]">
      <div className="flex h-8 items-center gap-1 border-b border-[#E5E5E5] bg-[#F8F8F8] px-2">
        <label className="sr-only" htmlFor="description-font-size">Font size</label>
        <select
          id="description-font-size"
          aria-label="Font size"
          defaultValue="3"
          onChange={(event) => runCommand('fontSize', event.target.value)}
          className="h-6 w-9 appearance-none border-0 bg-transparent pl-1 text-[11px] text-[#666] outline-none"
        >
          <option value="2">A</option>
          <option value="3">A</option>
          <option value="4">A</option>
          <option value="5">A</option>
        </select>
        <ChevronDown size={11} className="-ml-2 text-[#777]" />
        <span className="mx-1 h-4 border-l border-[#DDDDDD]" />
        {tools.map(({ label, command, icon: Icon }, index) => (
          <span key={command} className="contents">
            {index === 3 && <span className="mx-1 h-4 border-l border-[#DDDDDD]" />}
            <button
              type="button"
              aria-label={label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(command)}
              className="grid h-6 w-6 place-items-center rounded text-[#777] hover:bg-[#EDEDED] hover:text-ink"
            >
              <Icon size={14} strokeWidth={1.8} />
            </button>
          </span>
        ))}
      </div>
      <div
        ref={editorRef}
        role="textbox"
        aria-label="Description"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder="Type something"
        className="min-h-[90px] resize-y overflow-y-auto bg-white p-3 text-[12px] leading-5 text-ink outline-none empty:before:pointer-events-none empty:before:text-[#A0A0A0] empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  )
}
