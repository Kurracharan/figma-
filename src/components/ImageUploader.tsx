import { useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { ImageIcon, LoaderCircle, Trash2, UploadCloud } from 'lucide-react'
import type { UploadedImage } from '../types/product'

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: Dispatch<SetStateAction<UploadedImage[]>>
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(fileList: FileList | File[]) {
    const remaining = Math.max(0, 5 - images.length)
    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remaining)

    if (files.length === 0) return
    const newImages: UploadedImage[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      status: 'uploading',
    }))

    onChange((current) => [...current, ...newImages])
    newImages.forEach((image) => {
      window.setTimeout(() => {
        onChange((current) =>
          current.map((item) => item.id === image.id ? { ...item, status: 'done' } : item),
        )
      }, 1500)
    })
  }

  function removeImage(id: string) {
    const image = images.find((item) => item.id === id)
    if (image) URL.revokeObjectURL(image.url)
    onChange((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div>
      <span className="mb-1.5 block text-[10px] text-muted">Product Images</span>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={`flex h-20 flex-col items-center justify-center rounded-lg border border-dashed text-center ${
          dragging ? 'border-primary bg-pale-green' : 'border-[#CFCFCF] bg-[#FAFAFA]'
        }`}
      >
        <UploadCloud size={18} strokeWidth={1.6} className="mb-1 text-[#8D8D8D]" />
        <p className="m-0 text-[10px] text-[#777]">
          Drag and Drop or{' '}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-primary hover:underline"
          >
            Browse
          </button>{' '}
          to upload
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          aria-label="Upload product images"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files)
            event.target.value = ''
          }}
          className="hidden"
        />
      </div>
      <div className="mt-2 flex gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const image = images[index]
          return (
            <div
              key={image?.id ?? `empty-${index}`}
              className="group relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#F3F3F3] hover:bg-[#D9D9D9]"
            >
              {image?.status === 'uploading' ? (
                <LoaderCircle size={22} className="animate-spin text-primary" />
              ) : image ? (
                <>
                  <img src={image.url} alt="Uploaded product" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(image.id)}
                    className="absolute inset-0 m-auto grid h-6 w-6 place-items-center rounded-md bg-white/90 text-[#777] opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              ) : (
                <ImageIcon size={21} strokeWidth={1} className="text-[#A8A8A8]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
