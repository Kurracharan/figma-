import { useEffect, useRef, type KeyboardEvent } from 'react'

interface DeleteEventDialogProps {
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteEventDialog({ onCancel, onConfirm }: DeleteEventDialogProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const onCancelRef = useRef(onCancel)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    cancelButtonRef.current?.focus()
    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  useEffect(() => {
    onCancelRef.current = onCancel
  }, [onCancel])

  function handleCancel() {
    onCancelRef.current()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onCancelRef.current()
      return
    }
    if (event.key !== 'Tab' || !dialogRef.current) return

    const buttons = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/35 px-4"
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancelRef.current()
      }}
    >
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-event-title"
        aria-describedby="delete-event-description"
        onKeyDown={handleKeyDown}
        className="w-full max-w-[380px] rounded-[10px] border border-[#EDEDED] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.2)]"
      >
        <h2 id="delete-event-title" className="m-0 text-[16px] font-medium text-[#222]">
          Deleting Event
        </h2>
        <p id="delete-event-description" className="mb-6 mt-2 text-[13px] leading-5 text-[#666]">
          Are you sure you want to delete this event?
        </p>
        <div className="flex justify-end gap-2.5">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={handleCancel}
            className="h-9 min-w-[76px] rounded-md border border-[#E2E2E2] bg-white px-4 text-[12px] text-[#444] hover:bg-[#F7F7F7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 min-w-[64px] rounded-md bg-[#E5484D] px-4 text-[12px] font-medium text-white hover:bg-[#D83D43]"
          >
            Yes
          </button>
        </div>
      </section>
    </div>
  )
}
