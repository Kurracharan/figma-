import { Flower2 } from 'lucide-react'

export interface LogoProps {
  className?: string
  iconSize?: number
  textSize?: string
}

export default function Logo({ className = '', iconSize = 20, textSize = 'text-[13px]' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Flower2 size={iconSize} strokeWidth={1.8} className="text-primary shrink-0" />
      <span className={`${textSize} font-semibold tracking-[0.12em] text-[#222]`}>FLOWER</span>
    </div>
  )
}
