interface ConfirmDialogProps {
  calendarName: string
  eventCount: number
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ calendarName, eventCount, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 px-4" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel()
    }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-calendar-title" className="w-full max-w-[320px] rounded-[10px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <h2 id="delete-calendar-title" className="m-0 text-[14px] font-medium text-[#222]">Delete calendar?</h2>
        <p className="mb-5 mt-2 text-[12px] leading-5 text-[#555]">
          Delete '{calendarName}' and its {eventCount} {eventCount === 1 ? 'event' : 'events'}?
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="h-8 rounded-md border border-[#E5E5E5] px-3 text-[11px] text-[#444]">Cancel</button>
          <button type="button" onClick={onConfirm} className="h-8 rounded-md bg-[#FDECEC] px-3 text-[11px] font-medium text-status-red">Delete</button>
        </div>
      </div>
    </div>
  )
}
