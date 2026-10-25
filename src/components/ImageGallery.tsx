import { ImageIcon } from 'lucide-react'
import { useState } from 'react'

interface ImageGalleryProps {
  name: string
  images: string[]
}

export default function ImageGallery({ name, images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex]

  return (
    <div className="w-full min-w-0 md:w-[260px] md:shrink-0">
      <div className="grid h-[260px] place-items-center overflow-hidden bg-[#F7F7F7] sm:h-[300px] md:h-[330px]">
        {currentImage ? (
          <img src={currentImage} alt={name} className="h-full w-full object-contain p-4" />
        ) : (
          <ImageIcon size={48} strokeWidth={1} className="text-[#B5B5B5]" aria-hidden="true" />
        )}
      </div>
      <div className="mt-[10px] flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: Math.max(4, images.length) }, (_, index) => (
          <button
            type="button"
            key={images[index] ?? `placeholder-${index}`}
            aria-label={`Show image ${index + 1}`}
            aria-pressed={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
            className={`grid h-[65px] w-[65px] shrink-0 place-items-center overflow-hidden bg-[#F7F7F7] ${
              selectedIndex === index ? 'border border-primary' : 'border border-transparent'
            }`}
          >
            {images[index] ? (
              <img src={images[index]} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <ImageIcon size={16} strokeWidth={1} className="text-[#B5B5B5]" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
