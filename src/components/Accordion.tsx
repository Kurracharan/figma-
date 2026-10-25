import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'

interface AccordionProps {
  id: string
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export default function Accordion({ id, title, open, onToggle, children }: AccordionProps) {
  return (
    <section className="rounded-[10px] border border-[#EDEDED] p-4">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-content`}
          onClick={onToggle}
          className="flex w-full items-center justify-between text-left text-[15px] font-medium text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9EE8E]"
        >
          {title}
          {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </button>
      </h3>
      <div
        id={`${id}-content`}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="min-h-0 overflow-hidden pt-3 text-[11px] text-[#777]">{children}</div>
      </div>
    </section>
  )
}
