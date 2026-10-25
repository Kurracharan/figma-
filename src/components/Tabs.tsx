import { Grid2X2, List } from 'lucide-react'

export type ProductFilter = string
export type ViewMode = 'list' | 'grid'

interface TabsProps {
  activeTab: ProductFilter
  onChange: (tab: ProductFilter) => void
  counts: Record<string, number>
  labels?: string[]
  viewMode?: ViewMode
  onViewModeChange?: (viewMode: ViewMode) => void
  showViewToggle?: boolean
  variant?: 'underline' | 'folder'
}

const productTabLabels = ['All', 'Available', 'Disabled']

export default function Tabs({
  activeTab,
  onChange,
  counts,
  labels = productTabLabels,
  viewMode = 'list',
  onViewModeChange,
  showViewToggle = true,
  variant = 'underline',
}: TabsProps) {
  const folderStyle = variant === 'folder'

  return (
    <div className={`flex min-w-0 items-end justify-between ${folderStyle ? '' : 'border-b border-line'}`}>
      <div className={`flex items-end ${folderStyle ? 'gap-1' : 'gap-7'}`}>
        {labels.map((label) => (
          <button
            type="button"
            key={label}
            onClick={() => onChange(label)}
            className={folderStyle
              ? `relative -mb-px flex h-9 items-center gap-2 rounded-t-lg border border-b-0 px-3 text-[12px] ${
                  activeTab === label
                    ? 'z-[1] border-[#EDEDED] bg-white font-medium text-ink'
                    : 'border-[#EDEDED] bg-[#F8F8F8] text-muted hover:text-ink'
                }`
              : `flex h-11 items-center gap-2 border-b-2 px-0.5 pt-1 text-[12px] ${
                  activeTab === label
                    ? 'border-primary font-medium text-ink'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
          >
            {label}
            <span className="rounded-full bg-[#F0F0F0] px-2 py-0.5 text-[10px] leading-4 text-[#777]">
              {counts[label]}
            </span>
          </button>
        ))}
      </div>
      {showViewToggle && (
      <div className="mb-2 flex items-center gap-2 border-l border-line pl-3">
        <button
          type="button"
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
          onClick={() => onViewModeChange?.('list')}
          className={`grid h-7 w-7 place-items-center rounded ${
            viewMode === 'list' ? 'text-primary' : 'text-muted'
          }`}
        >
          <List size={17} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
          onClick={() => onViewModeChange?.('grid')}
          className={`grid h-7 w-7 place-items-center rounded ${
            viewMode === 'grid' ? 'text-primary' : 'text-muted'
          }`}
        >
          <Grid2X2 size={16} strokeWidth={1.8} />
        </button>
      </div>
      )}
    </div>
  )
}
