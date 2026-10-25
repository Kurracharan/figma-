import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Download, FileSpreadsheet, FileText, Printer } from 'lucide-react'

export interface ExportColumn {
  key: string
  label: string
}

interface ExportMenuProps<T> {
  data: T[]
  columns: ExportColumn[]
  filename: string
  selectedIds?: Set<string>
  getRowId?: (row: T) => string
  onEscapeListener?: (listener: ((event: KeyboardEvent) => boolean) | null) => void
}

const options = [
  { label: 'Print', Icon: Printer },
  { label: 'Excel', Icon: FileSpreadsheet },
  { label: 'PDF', Icon: FileText },
  { label: 'CSV', Icon: FileText },
] as const

function printableValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleDateString()
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function csvEscape(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export default function ExportMenu<T>({
  data,
  columns,
  filename,
  selectedIds,
  getRowId,
  onEscapeListener,
}: ExportMenuProps<T>) {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLButtonElement[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const toastTimerRef = useRef<number | null>(null)
  const selectedData = selectedIds && selectedIds.size > 0 && getRowId
    ? data.filter((row) => selectedIds.has(getRowId(row)))
    : data

  useEffect(() => {
    if (!onEscapeListener) return
    onEscapeListener((event) => {
      if (event.key !== 'Escape' || !open) return false
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
      return true
    })
    return () => onEscapeListener(null)
  }, [onEscapeListener, open])

  useEffect(() => {
    if (!open) return
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current)
  }, [])

  function announceExport(kind: string) {
    setToast(`Exported ${selectedData.length} rows as ${kind}`)
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 3000)
  }

  async function exportRows(kind: typeof options[number]['label']) {
    const records = selectedData.map((row) =>
      Object.fromEntries(columns.map((column) => [
        column.label,
        printableValue((row as Record<string, unknown>)[column.key]),
      ])),
    )
    const safeFilename = filename.replace(/[<>:"/\\|?*]+/g, '-')

    if (kind === 'Print') {
      const printArea = menuRef.current?.querySelector<HTMLElement>('.print-export-area')
      printArea?.setAttribute('data-print-active', 'true')
      const clearPrintTarget = () => printArea?.removeAttribute('data-print-active')
      window.addEventListener('afterprint', clearPrintTarget, { once: true })
      window.print()
    } else if (kind === 'CSV') {
      const header = columns.map((column) => csvEscape(column.label)).join(',')
      const body = selectedData.map((row) =>
        columns.map((column) => csvEscape(printableValue((row as Record<string, unknown>)[column.key]))).join(','),
      )
      downloadBlob(new Blob([[header, ...body].join('\r\n')], { type: 'text/csv;charset=utf-8' }), `${safeFilename}.csv`)
    } else if (kind === 'Excel') {
      const XLSX = await import('xlsx')
      const worksheet = XLSX.utils.json_to_sheet(records, { header: columns.map((column) => column.label) })
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Export')
      const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      downloadBlob(new Blob([output], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${safeFilename}.xlsx`)
    } else {
      const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text(filename, 14, 18)
      autoTable(doc, {
        head: [columns.map((column) => column.label)],
        body: selectedData.map((row) => columns.map((column) => printableValue((row as Record<string, unknown>)[column.key]))),
        startY: 25,
        styles: { fontSize: 8 },
      })
      doc.save(`${safeFilename}.pdf`)
    }
    announceExport(kind)
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = menuItemsRef.current.filter(Boolean)
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = current < 0 ? (step > 0 ? 0 : items.length - 1) : (current + step + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
          event.preventDefault()
          setOpen(true)
          window.requestAnimationFrame(() => {
            const index = event.key === 'ArrowDown' ? 0 : options.length - 1
            menuItemsRef.current[index]?.focus()
          })
        }}
        className={`flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-[11px] text-[#555] outline-none focus-visible:ring-1 focus-visible:ring-[#B9EE8E] ${open ? 'border-[#B9EE8E]' : 'border-[#E5E5E5]'}`}
      >
        <Download size={14} />
        <span>Export</span>
        <ChevronDown size={13} className="text-muted" />
      </button>
      {open && (
        <div
          ref={(element) => {
            if (element) menuItemsRef.current = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
          }}
          role="menu"
          aria-label={`Export ${filename}`}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-[130px] rounded-[10px] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {options.map(({ label, Icon }, index) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              ref={(element) => {
                if (element) menuItemsRef.current[index] = element
              }}
              onClick={() => {
                void exportRows(label)
                  .catch((error: unknown) => {
                    console.error(`Failed to export ${filename} as ${label}`, error)
                    setToast(`Export failed: ${label}`)
                  })
                  .finally(() => setOpen(false))
              }}
              className="flex h-[30px] w-full items-center gap-2 rounded-lg px-2 text-left text-[12px] text-[#333] hover:bg-[#F3F3F3] focus:bg-[#F3F3F3] focus:outline-none"
            >
              <Icon size={14} className="text-[#888]" />
              {label}
            </button>
          ))}
        </div>
      )}
      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-[100] rounded-lg bg-[#222] px-4 py-2.5 text-[12px] text-white shadow-lg">
          {toast}
        </div>
      )}
      <div className="hidden print-export-area">
        <h1>{filename}</h1>
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr>
          </thead>
          <tbody>
            {selectedData.map((row, index) => (
              <tr key={getRowId?.(row) ?? index}>
                {columns.map((column) => (
                  <td key={column.key}>{printableValue((row as Record<string, unknown>)[column.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
